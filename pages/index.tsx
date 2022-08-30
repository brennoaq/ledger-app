import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import 'core-js/actual';
import { listen } from "@ledgerhq/logs";
import AppBtc from "@ledgerhq/hw-app-btc";

// Keep this import if you want to use a Ledger Nano S/X/S Plus with the USB protocol and delete the @ledgerhq/hw-transport-webhid import
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
// Keep this import if you want to use a Ledger Nano S/X/S Plus with the HID protocol and delete the @ledgerhq/hw-transport-webusb import
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import { Button, Flex, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react';

const Home: NextPage = () => {
  const [account, setAccount] = useState('')

  async function connectWithLedger(){
    try {
      // Keep if you chose the USB protocol
      const transport = await TransportWebUSB.create();
  
      // Keep if you chose the HID protocol
      const transport = await TransportWebHID.create();
  
      //listen to the events which are sent by the Ledger packages in order to debug the app
      listen(log => console.log(log))
  
      //When the Ledger device connected it is trying to display the bitcoin address

      const appBtc = new AppBtc(transport);
      
      const { bitcoinAddress } = await appBtc.getWalletPublicKey(
        "44'/0'/0'/0/0",
        { verify: false, format: "legacy"}
      );
    
  
      setAccount(bitcoinAddress)
  
      //Display the address on the Ledger device and ask to verify the address
      await appBtc.getWalletPublicKey("44'/0'/0'/0/0", {format:"legacy", verify: true});
    } catch (err) {
      alert(err);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Ledger App
        </h1>

        <div className={styles.description}>
        {account?`Your first Bitcoin address: ${account}` : 'Connect your Nano and open the Bitcoin app. Click on button to start...'} 
        </div>

        <Flex
          h="100%"
          justifyContent="center"
          alignItems="center">
          <Button
            px={8}
            bg={useColorModeValue('#151f21', 'gray.900')}
            color={'white'}
            rounded={'md'}
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
            }}
            onClick={() => connectWithLedger()}>
            Connect Ledger
          </Button>
        </Flex>
      </main>

      
    </div>
  )
}

export default Home

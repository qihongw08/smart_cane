import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SavvyStepperMain from './SmartStep';
import { useEffect } from 'react';
import { getPropertyValue, updateProperty } from '@/api/arduinoService';
import { sendSMS, sendEmail } from '@/api/sosService';
import { useState } from 'react';
import { getEmergencyContact, getEmergencyMessage } from '../api/storageUtil';

const BUTTON_PROPERTY_ID = 'a82fdd31-35a0-405f-b09f-59bbb143e01c';
const Stack = createNativeStackNavigator();

const App = () => {
  const [emergencyContact, setEmergencyContact] = useState('');
  const [emergencyMessage, setEmergencyMessage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const contact = await getEmergencyContact();
      const message = await getEmergencyMessage();
      setEmergencyContact(contact);
      setEmergencyMessage(message);
    };

    loadData();

    // Function to fetch data
    const fetchData = async () => {
      try {
        const buttonPressed : boolean = await getPropertyValue(BUTTON_PROPERTY_ID);
        if (buttonPressed) {
          console.log('sending email...');
          sendEmail('qihongw08@gmail.com');
          const property = {
            value : false
          }
          updateProperty(BUTTON_PROPERTY_ID, property);
        }
      } catch (error) {
        console.error("Error fetching data:");
      }
    };

    // Fetch data immediately when the component mounts
    fetchData();

    // Set up an interval to fetch data every 20 seconds
    const interval = setInterval(fetchData, 20000);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <SavvyStepperMain></SavvyStepperMain>
  );
};

export default App;
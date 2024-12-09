import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

function Form() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [result, setResult] = useState('');
    const htmlRef = useRef(null);
  
    const onSubmit = async (data) => {
        try {
          const response = await axios.get(`https://retro-internet20241208155639.azurewebsites.net/${data.searchValue}`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });

          console.log('Response:', response); 

          

          
          setResult({__html: response.data});
        } catch (error) {
          console.log('Full error:', error); 
          if (error.response) {
            console.log(error.response.data);
          }
          setResult('Error occurred: ' + error.message);
        }
      };
    

    return (
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              {...register("searchValue", { 
                required: "This url required",
                minLength: { value: 1, message: "Please enter a valid url" }
              })}
              placeholder="Enter value"
            />
            {errors.searchValue && (
              <span style={{ color: 'red' }}>{errors.searchValue.message}</span>
            )}
            <button type="submit">Submit</button>
          </form>
          {result && 
            <div  
                style={{
                    all: 'initial',
                    fontFamily: 'inherit',
                }}
                class="preserve-original-html"
                ref={htmlRef}
                dangerouslySetInnerHTML={result}>
                
            </div>
          }
        </div>
      );
}

export default Form;
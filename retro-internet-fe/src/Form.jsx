import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import parse from 'html-react-parser';

function Form() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [result, setResult] = useState('');
    const htmlRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
  
      //just playing with styles in jsx, wouldn't do this for real
    const inputStyles = {
      width: '80%',
      padding: '10px',
      margin: '10px 0',
      fontSize: '16px',
      border: '2px solid #000',
      borderRadius: '4px'
    };

    const onSubmit = async (data) => {
        setIsLoading(true);

        try {
          const response = await axios.get(`https://retro-internet20241208155639.azurewebsites.net/${data.searchValue}`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });

          console.log('Response:', response);           
          setIsLoading(false);          
          setResult(response.data);
        } catch (error) {
          console.log('Full error:', error); 
          if (error.response) {
            console.log(error.response.data);
          }
          setResult('Error occurred: ' + error.message);
        }

        setIsLoading(false);
      };
    
    return (
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input 
              style={inputStyles}
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
          { isLoading ? 
            <div>Loading...</div> 
            :  
          result && 
            // <div  
            //     style={{
            //         all: 'initial',
            //         fontFamily: 'inherit',
            //     }}
            //     class="preserve-original-html"
            //     ref={htmlRef}>
            //       {parse(result)}
            // </div>          
            <iframe
            srcDoc={result}
            style={{
              width: '100%',
              height: '800px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
            sandbox="allow-same-origin allow-scripts allow-forms"
            title="rendered-content"
          />
        }
        </div>
      );
}

export default Form;
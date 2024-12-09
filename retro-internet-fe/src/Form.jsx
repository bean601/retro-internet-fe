import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import parse from 'html-react-parser';

function Form() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [result, setResult] = useState('');
    const htmlRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const iframeRef = useRef(null);
  
      //just playing with styles in jsx, wouldn't do this for real
    const inputStyles = {
      width: '80%',
      padding: '10px',
      margin: '10px 0',
      fontSize: '16px',
      border: '2px solid #000',
      borderRadius: '4px'
    };

    const buttonStyles = {
      width: '10%',
      padding: '10px',
      margin: '10px 0',
      fontSize: '16px',
      border: '2px solid #000',
      borderRadius: '4px'
    };

    const onSubmit = async (data) => {
        setIsLoading(true);

        try {
          //TODO: make URL an app setting
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

      const getModifiedHtml = (htmlContent) => {
        const script = `
          <script>
            document.addEventListener('click', function(e) {
              if (e.target.tagName === 'A') {
                e.preventDefault();
                window.parent.postMessage({
                  type: 'LINK_CLICK',
                  url: e.target.href
                }, '*');
              }
            });
          </script>
        `;
        
        return htmlContent.replace('</body>', `${script}</body>`);
      };

      useEffect(() => {
        const handleMessage = async (event) => {
          if (event.data && event.data.type === 'LINK_CLICK') {
            setIsLoading(true);
            try {

              console.log("trying to hit from iframe - " + event.data.url);

              const response = await axios.get(
                `https://retro-internet20241208155639.azurewebsites.net/${event.data.url}`,
                {
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  }
                }
              );
              setResult(response.data);
            } catch (error) {
              console.log('Error handling iframe click:', error);
              setResult('Error occurred: ' + error.message);
            }
            setIsLoading(false);
          }
        };
  
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
      }, []);
  
    
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
            <button style={buttonStyles} type="submit">GO!</button>
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
            ref={iframeRef}
            srcDoc={getModifiedHtml(result)}
            style={{
              width: '100%',
              height: '800px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
            sandbox="allow-same-origin allow-scripts allow-forms"
            title="90s-website"
          />
        }
        </div>
      );
}

export default Form;
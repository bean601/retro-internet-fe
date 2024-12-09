import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import parse from 'html-react-parser';
import './Form.css';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { ChevronLeft, ChevronRight } from 'lucide-react';

function Form() {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [result, setResult] = useState('');
    const htmlRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const iframeRef = useRef(null);
    const [history, setHistory] = useState([]);
    const [currentUrl, setCurrentUrl] = useState('');
    const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
    const urlInputRef = useRef(null);

    const back = () => {
      console.log('currentUrlIndex:', currentUrlIndex);
      if (currentUrlIndex > 0){
        setCurrentUrlIndex(currentUrlIndex - 1);
        loadHtmlFromApi(history[currentUrlIndex - 1]);
        setHistory(history.slice(0, currentUrlIndex));
      }
    }

    const forward = () => {
      console.log('currentUrlIndex:', currentUrlIndex);
      if (currentUrlIndex < history.length - 1){
        setCurrentUrlIndex(currentUrlIndex + 1);
        loadHtmlFromApi(history[currentUrlIndex + 1]);
        setHistory(history.slice(0, currentUrlIndex + 1));
    }
    } 

    const loadHtmlFromApi = async (url) => {
      setIsLoading(true);

      try {
        //TODO: make URL an app setting
        console.log('url passed in:', url);
        let urlToHit = `https://retro-internet20241208155639.azurewebsites.net/${url}`;
        console.log('urlToHit:', urlToHit);

        const response = await axios.get(urlToHit, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        console.log('Response:', response);
        setIsLoading(false);
        setResult(response.data);

        setCurrentUrl(url);
      } catch (error) {
        console.log('Full error:', error); 
        if (error.response) {
          console.log(error.response.data);
        }
        setResult('Error occurred: ' + error.message);
      }

      setIsLoading(false);
    };

    function getLastDomainPath(url) {
      const parts = url.split('/').filter(Boolean);
      const domainIndex = parts.findIndex(part => part.includes('.'));

      if (domainIndex >= 0) {
          const innerDomainIndex = parts.findIndex(part => part.includes('.'));

          if (innerDomainIndex >= 0) {
            const joined = parts.slice(domainIndex).join('/');
            const cleaned = joined.substring(joined.indexOf('/') + 1);
            return cleaned;
          } else {
            return parts.slice(domainIndex).join('/');
          }
      }
      return '';
  }

    const onSubmit = async (data) => {
      setCurrentUrlIndex(currentUrlIndex + 1);
      setHistory([...history, data.searchValue]); 
      return loadHtmlFromApi(data.searchValue);
    };

      const getModifiedHtml = (htmlContent) => {
      //  const cleanHtml = htmlContent.replace(/<script[^>]*src=["'](?:.*archive\.org|.*wombat\.js|.*bundle-playback\.js)[^>]*><\/script>/g, '');
        
        const script = `
          <script>
            document.addEventListener('click', function(e) {
              const link = e.target.closest('a'); 
              if (link) {
                e.preventDefault();
                const url = link.href;
                window.parent.postMessage({
                  type: 'LINK_CLICK',
                  url: url
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
            let rawUrl = event.data.url;
            let cleanedUrl = getLastDomainPath(rawUrl);
            console.log('rawUrl:', rawUrl);
            console.log('cleanedUrl:', cleanedUrl);

            setValue("searchValue", cleanedUrl);

            loadHtmlFromApi(cleanedUrl);
          }
        };
      
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
      }, []);
    
    return (
      <div>
      {errors.searchValue && (
        <div className="mb-2">
          <span className="text-red-500">{errors.searchValue.message}</span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <button 
            onClick={back} 
            disabled={currentUrlIndex > 0}
            className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={forward} 
            disabled={currentUrlIndex < history.length - 1}
            className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
          >
            <ChevronRight size={24} />
          </button>
        </div>
        <form 
          onSubmit={handleSubmit(onSubmit)} className="flex-1 flex gap-2">
          <input 
             ref={(e) => {
              urlInputRef.current = e
              register("searchValue").ref(e)
            }}
            className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("searchValue", { 
              required: "This url required",
              minLength: { value: 1, message: "Please enter a valid url" }
            })}
            placeholder="Enter nostalgic url"
          />
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="submit"
          >
            GO!
          </button>
        </form>
      </div>
          { isLoading ? 
            <Skeleton count={33} />
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
            sandbox="allow-same-origin allow-forms allow-modals allow-scripts"
            title="90s-website"
          />
        }
        </div>
      );
}

export default Form;

import React, { useState, useEffect } from 'react';
import './App.css';
import CountriesSearch from './CountriesSearch';
import Axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import {useDebounce} from './debounce';

function App() {
  const caretDownIcon = <FontAwesomeIcon icon={faCaretDown} />
  const searchIcon = <FontAwesomeIcon icon={faSearch} />


  const [selectedCountry,setSelectedCountry] = useState('');
  const [showCountryList,setShowCountryList] = useState(false);
  const [countryLimit,setCountryLimit] = useState(5);
  const [searchedCountry, setSearchedCountry] = useState('');
  const [isSearching , setIsSearching ]= useState(false);
  const [countries,setCountries] = useState( []);
  const debouncedSearch = useDebounce(searchedCountry, 500);

  useEffect(() =>{
    setIsSearching(true);
    //trying to replicate a real time scenario by adding timeout
    setTimeout(() =>{
      getAllCountries();
    },3000);
  },[]);


  const getAllCountries = () => {
    Axios.get('https://restcountries.eu/rest/v2/all')
      .then((response) =>{
        setIsSearching(false)
        setCountries(response.data);
      }).catch(error => {
        setIsSearching(false)
        console.log(error);
      });
  }
  const countryListToggle = (event) =>{
    event.preventDefault();
    setShowCountryList(!showCountryList);
  } 
  const handleChange = (e) =>{
      e.preventDefault();
  }

  const changeLimitToMax = () =>{
      setCountryLimit(countries.length);
  }

  useEffect(() =>{
    if(debouncedSearch){
      setIsSearching(true);
      apiToGetSearchCountry(debouncedSearch);
    }
  },[debouncedSearch])

  const search = (e) => {
      e.persist();
      setSearchedCountry(e.target.value);
      if(!e.target.value){
        return getAllCountries();
      }
  }


  const apiToGetSearchCountry = (e) =>{
    Axios.get('https://restcountries.eu/rest/v2/name/'+ e)
      .then((response) =>{
        setIsSearching(false);
        setCountries(response.data);
      }).catch(error => {
        setIsSearching(false);
        setCountries([]);
      });
  }


  const getSelCountry = (e,countryName) =>{
    setSelectedCountry(countryName);
  }

  return (
    <div className="App">
      
      <div className="smart-dropdown">
        <div className="select">
          <input className="select-location" readOnly="readonly" placeholder="Select a location"
            onChange={(e) => {handleChange(e)}} value={selectedCountry}
            onClick={(e) => {countryListToggle(e)}}/>
            {caretDownIcon}
        </div>
        
          {
            showCountryList ? 
              <div className="dropdown">
              <div className="search-field">
              <input onChange={(e) => {search(e)}} value={searchedCountry}/>  
              {searchIcon}
              </div>
              {isSearching ?  <p>Loading...</p> : 
              <CountriesSearch changeLimit={changeLimitToMax}
              countryList={countries.slice(0,countryLimit)} 
              total={countries.length} selCountry={getSelCountry}
              />}
              </div> 
            :
            null
          }
      </div>
       
    </div>
  );
}

export default App;

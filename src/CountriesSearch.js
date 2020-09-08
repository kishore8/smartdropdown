import React from 'react';


const CountriesSearch = React.memo((props) => {
        const showList =  (props.countryList.length > 0 ) ? true : false;
        return(
            <div className="country-list">
                {!showList  ? 
                <div>
                    <span>Country not found</span>
                    <button className="add-country" onClick={(e) => {props.addCountry(e)}}>Add Country</button>
                </div> :
                props.countryList.map(country => 
                    <li onClick={(e) => {props.selCountry(e,country.name)}} key={country.cioc} value={country.name}>
                        {country.name}
                    </li>)}
                {((props.total - props.countryList.length) > 0) ?
                <a className="showMore" onClick={props.changeLimit}> {'+' + ( props.total - props.countryList.length) + ' more'} </a>
                : null}
            </div>       
        );
});

export default CountriesSearch;
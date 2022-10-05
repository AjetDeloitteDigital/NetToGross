import { LightningElement, track, wire } from 'lwc';
import getCurrentlyLoggedInUsersCountryCode from '@salesforce/apex/CTRL_NetToGross.getCurrentlyLoggedInUsersCountryCode';

export default class NetToGross extends LightningElement {
    inputValue;
    submitButton;
    countryCode;
    grossValueFound = false;
    grossValue;

    async renderedCallback() {
        if (!this.grossValueFound) {
        try {
            this.countryCode = await getCurrentlyLoggedInUsersCountryCode();
        } catch (e) {
            console.log(e);
        }
            this.inputValue = this.template.querySelector(".netvalue");
            this.submitButton = this.template.querySelector(".submit");
            this.submitButton.addEventListener('click', () => {
                this.netToGross()
            });
        }
    }

    async netToGross() {
        let netValue = parseFloat(this.inputValue.value);
        if (!netValue) return;
        let url = 'http://apilayer.net/api/rate?';
        let params = [
            {
                parameterName: 'access_key',
                parameterValue: '8d66167d075572cfd11237dd24b90158'
            }
            ,
            {
                parameterName: 'country_code',
                parameterValue: this.countryCode.toUpperCase()
            }
        ];

        for (let param of params) {
            url = url.concat(param.parameterName + "=" + param.parameterValue + "&");
        }

        url = url.slice(0, url.length - 1);
        
        try {
            const response = await fetch(url);
            const jsonResponse = await response.json();
            console.log(jsonResponse);
            this.grossValue = netValue/(1-(jsonResponse.standard_rate/100));
            this.grossValueFound = true;
        } catch (err) {
            console.log(err);
        }
    }
}
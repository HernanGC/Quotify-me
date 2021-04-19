'use strict';

var isTest = true;

class quotifyMe {

    _quoteButton;
    _quoteContent;
    _response;

    constructor() {
        this._quoteButton = document.getElementById('quote-button');
        this._quoteContent = document.getElementById('quote-content');
    }

    getQuote() {
        var self = this;
        this._quoteButton.addEventListener('click', function () {
            if (localStorage.getItem('quote') && self.quoteDateIsToday(localStorage.getItem('quote-date'))) {
                self.renderQuote(localStorage.getItem('quote'));
                return;
            }
            fetch('https://quotes.rest/qod.json?category=inspire')
            .then(res => res.json())
            .then(data => self.processQuoteData(data))
            .catch(err => self.processQuoteData(err));
        });
    }

    processQuoteData(quote) {
        if (quote) {
            if (quote?.success?.total) {
                let fullQuote = quote.contents.quotes[0];
                this.renderQuote([
                    fullQuote.quote,
                    fullQuote.author,
                    fullQuote.date
                ]);
                return;
            }
        }
        console.log(quote);
        this.renderQuote("Sorry, we couldn't get the quote this time :(");
    }
    
    renderQuote(quoteData) {
        this._quoteButton.style.display = 'none';
        this._quoteContent.style.opacity = 1;
        if (Array.isArray(quoteData)) {
            if (!localStorage.getItem('quote-date')) {
                localStorage.setItem('quote-date', quoteData[2]);
            }
            let quote = `"${quoteData[0]}" - ${quoteData[1]}`;
            this._quoteContent.textContent = quote;
            if (!localStorage.getItem('quote') || localStorage.getItem('quote') !== quote) {
                localStorage.setItem('quote', quote);
            }
        } else {
            this._quoteContent.textContent = quoteData;
        }
    }

    quoteDateIsToday(quoteDate) {
        let date = new Date().toISOString();
        date = date.split('T')[0];
        if (date === quoteDate) {
            return true;
        }
        return false;
    }
}

let Quotifier = new quotifyMe();
Quotifier.getQuote();

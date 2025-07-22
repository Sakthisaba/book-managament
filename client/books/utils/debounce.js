export class Debouncer {
    constructor() {
        this.debouncedInterval = true;
        this.debouncedCall = null;
        this.previousCalltime = new Date().getTime();
    }
    debounce(func,...arg){
        console.log('curr time',new Date().getTime());
        console.log('prev time',this.previousCalltime);
        console.log('diff',new Date().getTime()-this.previousCalltime)

        if((new Date().getTime()-this.previousCalltime)<1000){ 
            this.debounuchedInterval = false;
            console.log('within 5 min')
            clearTimeout(this.debounchedCall);
            this.debounchedCall = setTimeout(() => { func(...arg); }, 500);
            return false;
        }
        console.log('can make call')
        this.previousCalltime = new Date().getTime();

        return true;
    }

}
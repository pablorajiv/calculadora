class CalcController{ //classe é um conjunto de métodos e atributos
    constructor(){
        /*
          this = comando interno que referencia atributos e metodos.
        */

        this._audio = new Audio('click.mp3'); 
        this._audioOnOff = false
        
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = "pt-BR";
        this._displayCalcEl = document.querySelector("#display");
        this._currentDateEl = document.querySelector("#date");
        this._hourEl = document.querySelector("#hour");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();
    };

    copyToClipboard(){

        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy")

        input.remove();

    }

    pasteFromClipBoard(){

        document.addEventListener('paste', e=>{

            let text = e.clipboardData.getData('text');

            this.displayCalc = parseFloat(text);
            console.log(text)
        });

    }

    initialize (){        
        
        this.displayDateHour();
        //setInterval = função executada em um intervalo de tempo (ms)
         let interval = setInterval(() => {
            this.displayDateHour();
        }, 1000);
        
        this.setLastNumberToDisplay(); 
        this.pasteFromClipBoard();

        document.querySelectorAll('.btn-ac').forEach(btn => {

            btn.addEventListener('dblclick', e=>{

                this.toggleAudio(); 
            })

        });
        
    };

    toggleAudio(){
        
        this._audioOnOff = !this._audioOnOff

    }

    playAudio(){

        if(this._audioOnOff){

            this._audio.currentTime = 0;
            this._audio.play();

        }

    }

    initKeyboard(){ // metodo para inicialização de eventos de teclado

        document.addEventListener('keyup', e=>{

            this.playAudio();

            switch(e.key){
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.cancelEntry();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':    
                    this.addOperation(e.key);
                    break;
        
                case 'Enter':
                case '=':
                    this.calc();
    
                    break;
                case '.':
                case ',':
                    this.addDot();
                    break;
    
                case '0': 
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(e.key);
                    break;

                case 'c':
                    if(e.ctrlKey) this.copyToClipboard();
                    break;
        
            
            }

        });

    }

    addEventListenerAll(element, events, fn){ //método para separar todos os eventos
        //split serve para setar um divisor em uma string e tranforma-la em array 
        events.split(' ').forEach( event =>{

            element.addEventListener(event, fn, false);

        });

    };

    clearAll(){ //metodo para o botao AC

        this._operation = [];
        this._lastNumber = "";
        this._lastOperator = "";

        this.setLastNumberToDisplay()

    }   

    cancelEntry(){ //metodo para o botao CE
        //pop é um metodo do javascript que elimina o ultimo elemento do array.
        this._operation.pop();

        this.setLastNumberToDisplay()

    }

    setLastOperation(value){

        this._operation[this._operation.length - 1] = value; 

    }

    getLastOperation(){
        //retorna ultimo elelmento do array
         return this._operation[this._operation.length -1];

    }

    isOperator(value){

        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
        
    }

    pushOperation(value){

        this._operation.push(value);

        if(this._operation.length > 3) {

            this.calc()

        };

    }

// .join altera o separador dentro de um array
//A função eval() computa um código JavaScript representado dentro de () como uma string() avalia expressões aritméticas automaticamente.)
    getResult(){        

        try{    
            return eval(this._operation.join(" "));
        }catch(e){

            setTimeout(()=>{

            }, 1);
            
            this.setError();
        }
    
    }    
    
    calc(){ //metodo para os calculos
        
        let last ='';
        this._lastOperator = this.getLastItem();

        if(this._operation.length < 3){

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }
        
        if(this._operation.length > 3){
            
            last = this._operation.pop();

            this._lastNumber = this.getResult();
        }else if(this._operation.length == 3) {

            this._lastNumber = this.getLastItem(false);

        }

        let result = this.getResult();

        if(last == "%"){

            result /= 100
            this._operation = [result];

        }else{
            
            this._operation = [result];

            if(last) this._operation.push(last);

        }
        this.setLastNumberToDisplay()

    }

    getLastItem(isOperator = true){

        let lastItem;

        for(let i =  this._operation.length-1; i >= 0; i--){

            if(this.isOperator( this._operation[i]) == isOperator){
                    
                lastItem = this._operation[i];
                break;
            }

        }

        if(!lastItem){

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }
        return lastItem;
    }

    setLastNumberToDisplay(){
        let lastNumber = this.getLastItem(false);   

        if(!lastNumber) lastNumber=0;

        this.displayCalc = lastNumber;
    }

    addOperation(value){ //isNaN = Is Not a Number verifica se é numero ou nao.

        if(isNaN(this.getLastOperation())){

            if(this.isOperator(value)){ //se for operador
                //trocar operador
                this.setLastOperation(value);

            }else{
                //push serve para adicionar um item no array.
                this.pushOperation(value);
                this.setLastNumberToDisplay()

            }
        
        }else{
            if(this.isOperator(value)) {

                this.pushOperation(value)

            }else{
                
                let newValue = this.getLastOperation().toString() + value.toString() 
                this.setLastOperation(newValue);

                this.setLastNumberToDisplay()

            }

        }

    }

    setError(){

        this.displayCalc = "Error"

    }

    addDot(){

        let lastOperation = this.getLastOperation();

        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if(this.isOperator(lastOperation) || !lastOperation){

            this.pushOperation('0.');

        }else{

            this.setLastOperation(lastOperation.toString()+ '.');
        }

        this.setLastNumberToDisplay();


    }

    execBtn(value){

        this.playAudio();

        switch(value){
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.cancelEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
                this.calc();

                break;
            case 'ponto':
                this.addDot();
                break;

            case '0': 
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
                
            default:
                this.setError();
                break;

        
        }

    }

    initButtonsEvents(){//método para aplicar todos os eventos

        let buttons = document.querySelectorAll("#buttons > g, #parts > g") //querySelectorAll = consulta todas ids e classes 

        buttons.forEach((btn, index) =>{

            this.addEventListenerAll(btn, 'click drag', e =>{

                let textBtn = btn.className.baseVal.replace("btn-", "");
                    //console.log(btn.className.baseVal.replace("btn-", ""))
                this.execBtn(textBtn);
                
            });

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e =>{
                
                btn.style.cursor = "pointer"

            });
        });
    };

    displayDateHour(){//metodo para usar datas e horas atuais

        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
        this.displayHour = this.currentDate.toLocaleTimeString(this._locale);

    };
    
    
    //metodos get
    get displayHour(){

        //innerHTML é usado para inserir um valor no elemento (HourEl) dentro do html
        return this._hourEl.innerHTML;

    }
    
    get displayDate(){
      
        return this._currentDateEl.innerHTML;

    }
    
    get displayCalc(){
      
        return this._displayCalcEl.innerHTML; 

    }

    get currentDate(){
        
        return new Date();

    }    
    
    //metodos set
    
    set displayHour(value){
        
        return this._hourEl.innerHTML = value;

    }
    
    set displayDate(value){
        
        return this._currentDateEl.innerHTML = value;

    }

    set displayCalc(value) {
        
        if(value.toString().length > 10){
            this.setError();
            return false;   
        }
        this._displayCalcEl.innerHTML = value;

    }
    
    set currentDate (value){
        this._currentDate = value;
    }
    
};


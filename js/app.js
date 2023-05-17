window.onload = startPreloadChain;

const imgArr = [];
let data = null;

//------------------------------------------------
const container = document.querySelector('.container');

//--------------Load Data & sources---------------
function startPreloadChain(){
    //console.log('startPreloadChain');
    loadData();
}

function loadData(){
    //console.log('loadData');

    fetch('../data/test1.json')
        .then(response=>response.json())
        .then(result=>{
            data = result;
            return onDataPreloaded();
        })
        .catch(error=>{
            console.log(error);
        })
}

function onDataPreloaded(){
    //console.log('onDataPreloaded');

    findPict(data);
    preloadPictures(data['srcImg'], imgArr, init);

}

function findPict(array){
    for (let key in array){
        if (key.includes('img')) {
            if (typeof array[key] === 'object'){
                for (let temp of array[key]) imgArr.push(temp);
            } else {
                imgArr.push(array[key]);
            }
        }
        else if (typeof array[key] === 'object') {
            findPict(array[key])
        }
    }
}

function preloadPictures(path ,sources, callback) {
    const images = [];
    let loadedImagesCounter = 0;
    for(let i = 0; i < sources.length; i++)
    {
        const srcName = sources[i];
        images[srcName] = new Image();
        images[srcName].onload = ()=>{
            if(++loadedImagesCounter >= sources.length)
                callback(images);
        }
        images[srcName].src = path + srcName;
    }
}

//----------------------INIT------------------------
function init()
{
    //console.log("init")
    //addElement(data.questions[7], 'question', 1);
    let test = startTest(data);
    test();
}


function startTest(data){

    let sectArr = [];
    let sectionProgress = 0;

    let resultArr = [];

    sectArr.push([data.description, "description"]);
    for (let section of data.questions){
        sectArr.push([section, "question"]);
    }

    function addElement(){

        if (!sectArr[sectionProgress]) return;

        let sectionData = sectArr[sectionProgress][0];
        let sectionType = sectArr[sectionProgress][1];

        let sectionStruct = [];
        let sectionText = [];
        let sectionImg = [];
        let sectionAnswers = [];

        let sectionBtn = null;


        //structure of section & init text and img

        if (sectionData.text) sectionText = sectionData.text.split(/[|{}]/);

        for (let i in sectionText){
            if (sectionText[i].includes('img')){
                sectionStruct.push('img');
                sectionImg.push(sectionData[sectionText[i]]);
                sectionText[i] = "";
            }else {
                if (sectionText[i])
                    sectionStruct.push('text');
            }
        }
        sectionText = sectionText.filter((n) => {return n != ""});

        //init progress-bar answers
        if (sectionData.answers){
            sectionStruct.unshift("progress")

            for (let ans of  sectionData.answers){
                sectionAnswers.push([ans.text, ans.value])
                sectionStruct.push('ans');
            }
        }

        //init btn
        if (sectionData.btn){
            sectionBtn = sectionData.btn;
            sectionStruct.push('btn');
        }

        //-----------Create DOM section element-------------

        let section = document.createElement('div')
        container.append(section);

        //tittle
        let temp = document.createElement('h1');
        temp.innerHTML = data.name;
        temp.classList.add('tittle');
        section.append(temp);

        //inner
        let inner = document.createElement('div');
        inner.classList.add('inner');
        section.append(inner);

        let ansCounter = 0;

        for (let el of sectionStruct){
            if (el === 'text'){
                temp = document.createElement('p');

                temp.classList.add("inner__text", "text");
                temp.innerHTML = sectionText.shift();

                inner.append(temp);

            }else if (el === 'img'){

                let tempSrc = data["srcImg"]+sectionImg.shift();

                temp = document.createElement('div');

                temp.classList.add("inner__img", "img");
                temp.style.backgroundImage = `url("${tempSrc}")`;
                temp.style.height = Math.floor(getImgParam(tempSrc, 'height')*0.75) + 'px'


                inner.append(temp);

            }else if (el === 'ans'){

                if (!inner.querySelector('.inner__option')){
                    temp = document.createElement('div');
                    temp.classList.add("inner__option", "options");

                    inner.append(temp);
                }

                temp = document.createElement('div');

                let tempAns = sectionAnswers.shift();

                temp.classList.add("options__item", "item");
                temp.innerHTML = `<input type="radio" id="item_${ansCounter}" name="options" value="${tempAns[1]}">
                        <label for="item_${ansCounter}">${tempAns[0]}</label>`

                ansCounter++;
                inner.querySelector('.inner__option').append(temp);

            }else if (el === 'btn'){
                temp = document.createElement('button');

                temp.classList.add("btn")
                temp.innerHTML = sectionBtn;

                section.append(temp);

            }else if (el === 'progress'){
                temp = document.createElement('div');

                temp.classList.add("progress__bar");
                let progress = Math.ceil(sectionProgress/data.questions.length*100);
                temp.innerHTML = `<span data-progress="${progress}%">
                                    ${data.progressPercent?progress+"%":sectionProgress+" из "+data.questions.length}</span>`
                temp.querySelector("span").style.width = progress+"%";

                section.insertBefore(temp, section.querySelector('.inner'));

            }
        }

        if (sectionType == 'description'){
            section.classList.add('description-section');
            inner.classList.add('description-section__inner')

            temp = section.querySelector('.tittle');
            if (temp) temp.classList.add('description-section__tittle')

            temp = section.querySelector('.btn');
            if (temp) temp.classList.add('description-section__btn')

        } else if (sectionType == 'question'){
            section.classList.add('question-section');
            inner.classList.add('question-section__inner')

            temp = section.querySelector('.tittle');
            if (temp) temp.classList.add('question-section__tittle')

            temp = section.querySelector('.progress__bar');
            if (temp) temp.classList.add('question-section__progress__bar')

            temp = section.querySelector('.text');
            if (temp){
                temp.classList.remove('inner__text', 'text');
                temp.classList.add('inner__question', 'question');
            }
        }

        //------------Listeners-------------
        let buttons = [];

        //заполнение
        for (let btn of section.querySelectorAll('.btn'))
            buttons.push(btn);
        for (let btn of section.querySelectorAll('.item'))
            buttons.push(btn);

        //слушатель
        function handler(e) {
            if (this.querySelector("input")) resultArr.push(this.querySelector("input").value);

            for (let btn of buttons){
                btn.removeEventListener("click", handler);
            }
            
            //Удаление секции
            container.innerHTML = "";


            addElement();
        }

        for (let btn of buttons){
            btn.addEventListener("click", handler);
        }


        //----------------------------------
        return sectionProgress++;
    }

    return addElement;
}

//----------Get imgWidth-----------
function getImgParam(src, param){
    let tempImg = document.createElement('img');
    tempImg.src = src;

    return tempImg[param];
}


document.addEventListener("DOMContentLoaded",initSlider);
function initSlider(){
    window.SlTimer;
    start();
    }
function start (index){
    var arSlider = document.getElementById("slider");// Получаем слайдер
    if (arSlider.length === null) return;
    var arImg= arSlider.getElementsByTagName('IMG');//Получаем массив картинок
    var point = arImg.length;//Количество точек
    if (point == 0) return;
    var pSize= arSlider.getAttribute("pointSize");// Получаем размер точек
    if (pSize<5 || pSize === null || isNaN(pSize)) pSize=5;
    if (pSize>20) pSize=20;// размер точки(5-20) по умолчанию 5
    var pType = arSlider.getAttribute("type");
    if (pType === null) pType = "square";
    if ((pType != "square") && (pType != "circle")) pType = "square";
    var Swidth=arSlider.getAttribute("width");// Получаем размеры
    var Sheight=arSlider.getAttribute("height");
    arSlider.style.width=Swidth+"px";// Устанавливаем размеры
    arSlider.style.height=Sheight+"px";
    var time= arSlider.getAttribute("time");// Получаем время задержки
    var ornt = arSlider.getAttribute("orientation");// Получаем вариант расположения
    var step=0;// Шаг расположения точки
    if(ornt=="H" || ornt=="h"){
        step=Swidth/(point+1);
    }else{
        step=Sheight/(point+1);
    }
    if (index == undefined) {
            arSlider.addEventListener("click",SlClick);
            arSlider.addEventListener("mouseout",SlMouseOut);
            arSlider.addEventListener("mouseover",SlMouseOver);
            index=0;
            for(var a=1;a<=point;a++){
                setPoint(arSlider,ornt,step,a,pSize,pType); // Set 'SliderPoint' class for 'div' point elements
            }
        }
    showImg(arSlider,arImg,index,time);
    
}
function ClearActive(sl){
    var actEl=sl.getElementsByClassName("SliderPointActive");
    if (actEl.length != 0){
        for (var a=0;a<actEl.length;a++){
            actEl[a].classList.remove("SliderPointActive"); // reset active point
        }
    }
}
function showImg(sl,arImg,index,time){
    var stop=sl.getAttribute("stop");
    //console.log("showImg Stop="+stop);
    if ((stop=='true') && (time!=0)) return;   // Режим отображения по клику.Анимация картинок останавливается
    ClearActive(sl);
    //console.log("showImg arImg.len="+arImg.length+"\nindex="+index+"\ntime"+time);
    if (index>=arImg.length) index=0;
    
    sl.style.backgroundImage = "url("+arImg[index].getAttribute("src")+")";
    var df=sl.getElementsByClassName("SliderPoint");
    df[index].classList.add("SliderPointActive");
    index= index+1;
    if (index>=arImg.length) index=0;
    //console.log("showImg2 arImg.len="+arImg.length+"\nindex="+index+"\ntime"+time);
    
    sl.setAttribute("index",index);
    if (time !=0){
        SlTimer=setTimeout(showImg,time,sl,arImg,index,time);
    }
}
function setPoint(arSlider,ornt,step,a,pSize,pType){
    // Устанавливает точки слайдов
    var div= document.createElement("DIV");
    div.style.position= "absolute";
    div.style.width = pSize+"px";
    div.style.height=pSize+"px";
    div.classList.add("SliderPointBorder");
    if (pType=='circle'){
        div.classList.add("SliderPointBRadius");
    }
    if (ornt=='H' || ornt=='h'){
        var cc=step*a-(pSize)/2;
        div.style.bottom="20px";
        div.style.left=cc+"px";
    }else{
        var cc=step*a-(pSize)/2;
        div.style.top=cc+"px";
        div.style.right="20px";
    }
    div.classList.add("SliderPoint");
    div.id=a-1;
    div.addEventListener("click",pointClick);
    arSlider.appendChild(div);
}
function SetSlider(slider,index,time=0){
    // Устанавливает в фон изображение кадра номер index. time=0 для showImg. при этом можно активировать другие кадры.
    clearTimeout(SlTimer);
    var arImg= slider.getElementsByTagName('IMG');
    if (time == undefined) {
        time= arSlider.getAttribute("time");
    }
    showImg(slider,arImg,index,time);
    //console.log("SetSlider set index="+index);
    slider.setAttribute("index",index);
    
    
}
function pointClick(event){
    var id=event.target.id;
    var parent = event.target.parentNode;
    var point = parent.getElementsByClassName("SliderPoint");
    
    if (id>point.length) return;
    
    ClearActive(parent);
    point[id].classList.add("SliderPointActive");
    var arImg= parent.getElementsByTagName('IMG');
    parent.setAttribute("stop","true");
    SetSlider(parent,id);
    event.stopPropagation();
}
function SlClick(e){
    var target=e.target;
    var href=target.getElementsByClassName("SliderPointActive");
    var id=href[0].id;
    var src=target.getElementsByTagName('IMG')[id].getAttribute('href');
    window.open(src);
    ClearStop(e);
    
}
function SlMouseOut(e){
    if((e.relatedTarget==null)||e.relatedTarget.classList.contains("SliderPoint")) return;
    if(e.target.classList.contains("SliderPoint")) return;
    if(e.target.classList.contains("slider")) {
        ClearStop(e);
    }
}
function ClearStop (e){
    var trg=e.target;
        trg.setAttribute("stop",false);
        var index=Number(trg.getAttribute("index"));
        var arImg= trg.getElementsByTagName('IMG');
        var time= trg.getAttribute("time");
        showImg(trg,arImg,index,time)
}
function SlMouseOver(e){
    if(e.target.classList!="slider") return;
    clearTimeout(SlTimer);
}
function draw_grid(bgd_id,grid) {
    function Draw_line(card_id,x,y,x1,y1) {//利用div划线

        let para = document.getElementById(card_id);
        let node=document.createElement("div");
        node.style.backgroundColor="#444";
        node.style.position="absolute";
        node.style.left=x+"px";
        node.style.top=y+"px";
        node.style.height=y1+"px";
        node.style.width=x1+"px";


        para.appendChild(node);
    }


    let height=grid.h*grid.h_nums;
    let width=grid.w*grid.w_nums;

    let pos_x=0;
    let pos_y=0;
    for(let i=0;i<grid.w_nums+1;i++)
    {
        Draw_line(bgd_id,pos_x,0,1,height);
        pos_x+=grid.w;
    }
    for(let i=0;i<grid.h_nums+1;i++)
    {
        Draw_line(bgd_id,0,pos_y,width,1);
        pos_y+=grid.h;
    }
}






function Creat_card(card_bgd_id,card_item_class,set_card,move) {

    var mouse=move.mouse;

    function Creat_card_item(card_id,class_name) {
        this.status=new Object();
        this.status.onclick=0;
        this.status.ondown=0;
        this.status.onmove=0;
        this.status.index=0;

        let para = document.getElementById(card_id);
        var node=document.createElement("div");
        node.className=class_name;
        node.style.width=set_card.w+"px";
        node.style.height=set_card.h+"px";
        //node.innerHTML="<p>testttt</p>";
        //node.innerHTML+="<p>testttt</p>";
        //node.innerHTML+="<p>id=="+id+"</p>";

        this.status.node=node;

        para.appendChild(node);

    }

    function add_event(status) {
        status.node.addEventListener("mousedown", on_down);
        status.node.addEventListener("mouseup", on_up);
        function on_down()
        {
            status.onclick=1;
            status.node.style.left=mouse.x-set_card.card_w/2+"px";
            status.node.style.top=mouse.y-set_card.card_h/2+"px";
            status.node.style['z-index']="999";//将卡片放在最前面
            move.fresh_blank_index(mouse);
            //blank_index=pos_index.pos_to_index(mouse);

        }
        function on_up() {
            move.set_pos_index(mouse,status);
            status.node.style['z-index']="1";//卡片放在最后面
            status.onclick=0;
        }


    }

    this.creat=function creat(card_set) {
        let card=new Array();
        for(let i=0;i<card_set.w_nums*card_set.h_nums;i++)
        {
            let temp=new Creat_card_item(card_bgd_id,card_item_class,i);
            temp.status.index=i;
            card.push(temp.status);
            //console.log(temp.status.node);
            add_event(temp.status);
        }
        return card;

    }

}



function Pos_index(set_card) {//包含pos于index相互转换，以及卡片位置的设定


    let that=this;
    this.index_to_pos=function (index) {
        let end=new Object();
        end.x=(index%set_card.w_nums)*set_card.w;
        end.y=set_card.h*parseInt(index/set_card.w_nums);

        //console.log(end);
        return end;
    }
    this.pos_to_index=function (pos) {
        let end=parseInt(pos.y/set_card.h)*set_card.w_nums+parseInt(pos.x/set_card.w);
        //console.log(end);
        return end;


    }

    this.set_card_pos=function (ca,index) {
        var set=that.index_to_pos(index);

        ca.style.left=set.x+20+"px";
        ca.style.top=set.y+20+"px";
    }


    this.fresh_pos=function(card) {//根据index刷新卡片的位置

        for(let i=0;i<card.length;i++)
        {
            that.set_card_pos(card[i].node,card[i].index);
        }

    }

}


function Card_move(pos_index,card_bgd_id) {
    var blank_index=0;//记录空位的index
    var mouse=new Object();
    mouse.x=0;
    mouse.y=0;
    var that=this;

    this.mouse=mouse;
    function card_move() {//卡片移动算法
        let idx=pos_index.pos_to_index(mouse);//当前鼠标所在的index
        var card=that.card;
        for(let i=0;i<card.length;i++)
        {

            if(card[i].onclick==1)//遍历查找出被点击的卡片
            {

                if(blank_index!=idx)//如果鼠标移动到另一个网格中触发
                {

                    if(idx<blank_index)
                    {
                        for(let id=0;id<card.length;id++)
                        {
                            if(card[id].index>=idx&&card[id].index<blank_index)
                            {
                                card[id].index++;
                            }
                            //console.log(card[id].index);
                        }


                    }
                    else{
                        for(let id=0;id<card.length;id++)
                        {
                            if(card[id].index>blank_index&&card[id].index<=idx)
                            {
                                card[id].index--;
                            }

                        }


                    }
                    blank_index=idx;
                    card[i].index=idx;//复原被移动的index

                    pos_index.fresh_pos(card);

                }

                card[i].node.style.left=mouse.x-150/2+"px";
                card[i].node.style.top=mouse.y-100/2+"px";
                card[i].node.style.backgroundColor="#f40";
                //console.log( event.pageX + ".." + event.pageY);
            }

        }
    }


    var c = document.getElementById(card_bgd_id);
    var ps=c.getBoundingClientRect();

    mouse.x=0;
    mouse.y=0;
    c.onmousemove = function (event) {//鼠标移动事件,坐标是相对于一个div而言的
        var event = event || window.event;  //标准化事件对象
        if (event.pageX || event.pageY) {
            mouse.x=event.pageX-ps.left;
            mouse.y=event.pageY-ps.top;
            card_move();
        }
    }


    this.fresh_blank_index=function (mouse) {
        blank_index=pos_index.pos_to_index(mouse);

    }


    this.set_pos_index=function(mouse,status) {

        let index=pos_index.pos_to_index(mouse);
        pos_index.set_card_pos(status.node,index);
        status.index=index;

    }


}


function Card(card_bgd_id,card_item_class,set) {


    var w=150;
    var h=200;
    var w_nums=8;
    var h_nums=4;
    var card_w=100;
    var card_h=150;
    var pos_index=new Pos_index(set.grid);
    var move=new Card_move(pos_index,card_bgd_id);
    var mouse=move.mouse;
    var creat_card=new Creat_card(card_bgd_id,card_item_class,set.card,move);
    var card=creat_card.creat(set.card);

    move.card=card;

    pos_index.fresh_pos(card);

    if(set.grid.display==1)
    {
        draw_grid(card_bgd_id,set.grid);
    }

    return card;





}


function Creat_set() {

    var grid=new Object();
    var card=new Object();

    grid.w=150;
    grid.h=200;
    grid.w_nums=8;
    grid.h_nums=4;
    grid.display=1;

    card.w=100;
    card.h=150;
    card.w_nums=8;
    card.h_nums=4;
    card.pos_w=0;
    card.pos_h=0;

    this.grid=grid;
    this.card=card;
    var that=this;

    this.card_set=function (w,h,pos_w,pos_h) {
        that.card.w=w;
        that.card.h=h;
        that.card.pos_w=pos_w;
        that.card.pos_h=pos_h;
    }

    this.grid_set=function (w,h,w_nums,h_nums,display) {
        that.grid.w=w;
        that.grid.h=h;
        that.grid.w_nums=w_nums;
        that.grid.h_nums=h_nums;
        that.grid.display=display;
    }

}
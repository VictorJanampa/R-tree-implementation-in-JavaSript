class recta{
    constructor(poin,base,altura){
        this.poin=poin;
        this.base=base;
        this.altura=altura;
    }
    intersects(range){
		if(range.poin[0]+range.base>this.poin[0]+this.base)
			return false;
		if(range.poin[0]-range.base<this.poin[0]-this.base)
			return false;
		if(range.poin[1]+range.altura>this.poin[1]+this.altura)
			return false;
		if(range.poin[1]-range.altura<this.poin[1]-this.altura)
			return false;
		return true;
	}
	contains(point){
        return(point.x >= this.x - this.w &&
             point.x <= this.x + this.w &&
             point.y >= this.y - this.h &&
             point.y <= this.y + this.h);
    }
}
function aum_rect(rec,poin){
    var c=0;
    var x_min=rec.poin[0]-rec.base;
    var x_max=rec.poin[0]+rec.base;
    var y_min=rec.poin[1]-rec.altura;
    var y_max=rec.poin[1]+rec.altura;
    if (x_max<poin[0]){
        c+=2*(poin[0]-x_max);
        if (y_max<poin[1]){
            c+=2*(poin[1]-y_max);
        }
        else{
            if (y_min>poin[1]){
                c+=2*(y_min-poin[1]);
            }
        }
    }
    else{
        if (x_min>poin[0]){
            c+=2*(x_min-poin[0]);
            if (y_max<poin[1]){
                c+=2*(poin[1]-y_max);
            }
            else{
                if (y_min>poin[1]){
                    c+=2*(y_min-poin[1]);
                }
            }
        }
        else{
            if (y_max<poin[1]){
                c+=2*(poin[1]-y_max);
            }
            else{
                if (y_min>poin[1]){
                    c+=2*(y_min-poin[1]);
                }
            }
        }
    }
    return c;
}
var B=3
class node{
    constructor(recta){
        this.isleaf=true;
        this.sons=[];
        this.poins=[];
        this.recta=recta;
        this.parent=null;
    }
}
class Rtree{
    constructor(){
        this.root=null;
    }
    query(range,node,found){
        if(node.rect.intersects(range)){
        	if(node.isleaf){
	            for (var i = 0; i < node.points.length; i++) {
	                if(range.contains(node.points[i])){
	                    found.push(node.points[i]);
	                }
	            }
	        }
	        else{
	            for (var i = 0; i < node.sons.length; i++) {
	            	query(range,node[i],points)
	            }
	        }
        }
        else{
            return;
        }
    }
    update(root,nw){
        var c=false;
        var rec=root.recta;
        var x_min=rec.poin[0]-rec.base;
        var x_max=rec.poin[0]+rec.base;
        var y_min=rec.poin[1]-rec.altura;
        var y_max=rec.poin[1]+rec.altura;
        if (x_min>nw[0]){
            c=true;
            root.recta.poin[0]=(nw[0]+x_max)/2;
            root.recta.base=rec.poin[0]-nw[0];
        }
        if (x_max<nw[0]){
            c=true;
            root.recta.poin[0]=(nw[0]+x_min)/2;
            root.recta.base=nw[0]-rec.poin[0];
        }
        if (y_min>nw[1]){
            c=true;
            root.recta.poin[1]=(nw[1]+y_max)/2;
            root.recta.altura=rec.poin[1]-nw[1];
		}
        if (y_max<nw[1]){
            c=true;
            root.recta.poin[1]=(y_min+nw[1])/2;
            root.recta.altura=nw[1]-rec.poin[1];
        }
    }
    ordenar(poins,x){
        for(var i=0; i<poins.length;i++){
            for(var  j=i+1;j<poins.length;j++){
                if (poins[i][x]>poins[j][x]){
                	var temp=poins[i];
                	poins[i]=poins[j];
                	poins[j]=temp;
                }
            }
        }
    }
    build_poins(x){
        var x_min=x[0][0];
        var x_max=x[0][0];
        var y_min=x[0][1];
        var y_max=x[0][1];
        for (var i = 0; i < x.length; i++) {
        	x_min=Math.min(x_min,x[i][0]);
            x_max=Math.max(x_max,x[i][0]);
            y_min=Math.min(y_min,x[i][1]);
            y_max=Math.max(y_max,x[i][1]);
        }
        var r=new recta([(x_min+x_max)/2,(y_min+y_max)/2],(x_max-x_min)/2,(y_max-y_min)/2);
        return r;
    }
    dividir(poins,i){
        var m=poins.length;
        var med=Math.ceil(m/2);
        this.ordenar(poins,i);
        var a=poins.slice(0,med);
        var b=poins.slice(med,m);
        return [a,b]
    }
    ordenar_rect(rects,x){
        for(var i=0;i<rects.length;i++){
            for(var j=i+1;j<rects.length;j++){
                if (rects[i].recta.poin[x]>rects[j].recta.poin[x]){
                	var temp=rects[i];
                	rects[i]=rects[j];
                	rects[j]=temp;
                }
            }
        }
    }
    build_nodes(nodes){
        var x_min=nodes[0].recta.poin[0]-nodes[0].recta.base;
        var x_max=nodes[0].recta.poin[0]+nodes[0].recta.base;
        var y_min=nodes[0].recta.poin[1]-nodes[0].recta.altura;
        var y_max=nodes[0].recta.poin[1]+nodes[0].recta.altura;
        for(var i=1;i<nodes.length;i++){
            x_min=Math.min(x_min,nodes[i].recta.poin[0]-nodes[i].recta.base);
            x_max=Math.max(x_max,nodes[i].recta.poin[0]+nodes[i].recta.base);
            y_min=Math.min(y_min,nodes[i].recta.poin[1]-nodes[i].recta.altura);
            y_max=Math.max(y_max,nodes[i].recta.poin[1]+nodes[i].recta.altura);
        }
        var r=new recta([(x_max+x_min)/2,(y_max+y_min)/2],(x_max-x_min)/2,(y_max-y_min)/2)
        return r;
    }
    funcion(nodes,x){
        var n=nodes.length;
        this.ordenar_rect(nodes,x);
        var a=this.build_nodes([nodes[0]]);
        var b=this.build_nodes(nodes.slice(1,n));
        var c=[nodes[0]];
        var d=nodes.slice(1,n);
        var p=a.base*2+2*a.altura+b.base*2+2*b.altura;
        for (var i=1; i <n; i++) {
        	for (var j = 0; j < n-i+1; j++) {
        		var q=nodes.slice(j,j+i);
        		var w=concat(nodes.slice(0,j),nodes.slice(j+1,n));
        		console.log(q);
        		var q1=this.build_nodes(q);
        		var q2=this.build_nodes(w);
        		var p1=q1.base*2+2*q1.altura+q2.base*2+2*q2.altura;
        		if (p1<p) {
        			p=p1;
        			a=q1;
        			b=q2;
        			c=q;
        			d=w;
        		}
        	}
        }
        return [[a,c],[b,d]]
    }
    funcion1(nodes){
    	var aa=this.funcion(nodes,0);
    	var a=aa[0];
    	var b=aa[1];
    	var bb=this.funcion(nodes,1);
    	var c=bb[0];
    	var d=bb[1];
        var p1=2*(a[0].base)+2*(a[0].altura)+2*(b[0].base)+2*(b[0].altura);
        var p2=2*(c[0].base)+2*(c[0].altura)+2*(d[0].base)+2*(d[0].altura);
        if (p1<p2){
            return [a,b];
        }
        return [c,d];
    }
    separar(root){
        if (root.isleaf){
            var aa=this.dividir(root.poins,0);
            var a1=aa[0];
            var a2=aa[1];
            var bb=this.dividir(root.poins,1);
            var b1=bb[0];
            var b2=bb[1];
            var r11=this.build_poins(a1);
            var r12=this.build_poins(a2);
            var r21=this.build_poins(b1);
            var r22=this.build_poins(b2);
            var p1=2*(r11.base)+2*(r12.base)+2*(r11.altura)+2*(r12.altura);
            var p2=2*(r21.base)+2*(r22.base)+2*(r21.altura)+2*(r22.altura);
            if (p1<p2){
                root.poins=a1;
                root.recta=r11;
                var nw=new node(r12);
                nw.poins=a2;
                return nw;
            }
            else{
                root.poins=b1;
                root.recta=r21;
                var nw=new node(r22);
                nw.poins=b2;
                return nw;
            }
        }
        else{
        	var rr=this.funcion1(root.sons);
        	var rc1=rr[0];
        	var rc2=rr[1];
        	console.log(rr);
            root.recta=rc1[0];
            root.sons=rc1[1];
            var nw=new node(rc2[0]);
            nw.isleaf=false;
            nw.sons=rc2[1];
            return nw;
        }
    }
        
    handle_overflow(root){
    	var r=this.build_nodes([root]);
        var u=this.separar(root);
        if (root==this.root){
            var nw=new node(r);
            nw.isleaf=false;
            nw.sons.push(u);
            nw.sons.push(root);
            u.parent=nw;
            root.parent=nw;
            this.root=nw;
        }
        else{
            var w=root.parent;
            w.sons.push(u);
            u.parent=w;
            if (w.sons.length>B){
                this.handle_overflow(w);
            }
        }
    }
    cerc(b1,b2,poin){
        var a=aum_rect(b1.recta,poin);
        var b=aum_rect(b2.recta,poin);
        if (a<b){
            return b1;
        }
        return b2;
    }
    choose_subtree(root,poin){
        var s=root.sons;
        var c=s[0];
        for(var i=1;i<s.length;i++){
            c=this.cerc(c,s[i],poin);
        }
        return c;
    }
    insert(root,poin){
        if (this.root==null){
            var r=this.build_poins([poin]);
            var n=new node(r);
            n.poins.push(poin);
            this.root=n;
            return;
        }
        if (root.isleaf){
            this.update(root,poin);
            root.poins.push(poin);
            if (root.poins.length>B){
                this.handle_overflow(root);
            }
        }
        else{
        	this.update(root,poin);
            var v=this.choose_subtree(root,poin);
            this.insert(v,poin);
        }
     }
	/*show(){
		stroke ( 255 );
		strokeWeight ( 1 );
		noFill ();
		rectMode ( CENTER );
		rect ( this.boundary.x , this.boundary.y , this.boundary.w * 2 , this.boundary.h * 2 );
		if ( this.divided ){
			this.sonNO.show();
			this.sonNE.show();
			this.sonSO.show();
			this.sonSE.show();
		}
		for ( let p of this.poins ){
			strokeWeight (4 );
			poin( p . x , p . y );
		}
	}*/
}
function show(root,col){
	if(root!=null){
		stroke ( 255 );
		strokeWeight ( 1 );
		fill (col[0],col[1],col[2],20);
		rectMode ( CENTER );
		rect( root.recta.poin[0] , root.recta.poin[1] , root.recta.base * 2 , root.recta.altura * 2 );	
		if ( root.isleaf ){
			return;
		}
		for( let p of root.sons ){
			show(p,col);
		}
	}
}
function show2(root){
        stroke(255);
        strokeWeight(1);
        noFill();
        rectMode(CENTER);
        rect(root.rect.poin[0],root.rect.poin[1], root.rect.base*2,root.altura.h*2);
        if(!root.isleaf){
            for (var i = 0; i < root.sons.length; i++) {
                show2(root.sons[i]);
            }           
        }
        for(let p of root.points){
            strokeWeight(4);
            point(p[0], p[1]);
        }
    }
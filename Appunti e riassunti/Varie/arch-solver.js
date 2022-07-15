//Federico Rampazzo 2010-2011

function pow(x){ return Math.pow(2, x);}
function log(x){ return Math.log(x)/Math.log(2);}

function isNumber (str)
{
	var i = parseFloat (str);
	if (isNaN (i)) return false;
	i = i . toString ();
	if (i != str) return false;
	return true;
}

function toInt(string)
	{
		switch(string[string.length-2].toLowerCase())
		{
		case 'k':
			return parseInt(string)*1024;
		break;
		case 'm':
			return parseInt(string)*1024*1024;
		break;
		case 'g':
			return parseInt(string)*1024*1024*1024;
 		break;
		default:
				return parseInt(string);
		break;
		}
	}
function hexToBin(n, r)
{
     var i = parseInt(n, 16).toString(2);
     l = i.toString().length;
     if (l < r)
     {
        for (x=0; x<(r-l); x++)
            i = '0' + i; 
        return i;
     }else if (l>r){
        var s = '';
        for (x=l-r; x<l; x++)
            s = s + i[x];
        return s;
     }
     return '' + i;
}

function binToFloat(string, exp, mant)
{
    var n = "1" + string.substr(1+exp, mant);
    var point = parseInt(parseInt(string.substr(1, exp), 2).toString(10))-exp;
    var i = 0;
    var t = 0;
    while (i<n.length)
    {
        if (n[i]=='1')
        {
            t += Math.pow(2, point-i);
        }        
        i++;
    }
    if (string[0]=='1')
        return -t;
    else
        return t;
}


function floatToBin(string, exp, mant)
{
	if (string[0]=='-')
		t0 = '1 ';
	else
		t0 = '0 ';


	t1 = string.indexOf('.');
	t2 = Math.abs(parseInt(string));
	t4 = '';
	c=0;
	while(t2!=0)
	{	
		c++;	
		if (t2 % 2==0)
			t4 = '0' + t4;
		else
 			t4 = '1' + t4;
		t2 = Math.floor(t2/2);
	}
	t3 = parseFloat('0.' + string.substr(t1+1));
	t5 = '';
	c=0;
	o = false;
	if (t3!=0)
	{
	  while(c<mant)
	  {		
		  if (o==true) 
		    c++;
		  t3 = t3 * 2;
		  if (t3<1)
		  {
			  t5 += '0';
		  }else{
			  t5 += '1';
			  t3 = t3-1;
			  o = true;
		  }
	  }
	} else {
	  while(c<mant)
	  {		
		  c++;
		  t5 += '0';
	  }
	}

	t6 = (parseInt(t4) || 0) + '.' + t5;
    if (parseInt(t6)>0)
        var t8 = -t6.substring(t6.indexOf('1'), t6.indexOf('.')).length+1;
    else
        var t8 = t6.substring(t6.indexOf('.'), t6.indexOf('1')).length;

	t6 = parseFloat(t6) * Math.pow(10, t8);
	t6 = '' + t6;
	t8 = -t8 + exp;
	t9 = '';
	c=0;
	while(c<exp)
	{	
		c++;	
		if (t8 % 2==0)
			t9 = '0' + t9;
		else
			t9 = '1' + t9;
		t8 = Math.floor(t8/2);
	}
	t0 += t9 + ' ';
	t6 = t6.substr(2,  mant);
	c=-1;
	while(c<mant-1)
	{	
	  c++;
	  if (t6.length>c)
	    t0 += t6[c];
	  else
	    t0 += '0';
	}
	return t0;
}

function solver(type){
switch (type)
{
case 'direct':
this.formulas = {
    'cache': ['pow(line+log(block))'],
    'memory': ['pow(address)'],
    'block': ['pow(word)', 'pow(-line+log(cache))'],
    'address': ['log(memory)', 'word+line+tag'],
    'word': ['log(block)', 'address-line-tag'],
    'line': ['log(cache)-log(block)', 'address-word-tag'],
    'tag': ['address-word-line']
};
break;

case 'nways':
/*
this.formulas = {
    'ways': ['pow(-set+log(cache)-log(blocksperline)-log(block))'],
    'cache': ['pow(set+log(block)+log(blocksperline)+log(ways))'],
    'memory': ['pow(address)'],
    'block': ['pow(word)', 'pow(-set+log(cache)-log(blocksperline)-log(ways))'],
    'blocksperline': ['pow(-set+log(cache)-log(ways)-log(block))'],
    'address': ['log(memory)', 'word+set+tag'],
    'word': ['log(block)', 'address-set-tag'],
    'set': ['log(cache)-log(block)-log(blocksperline)-log(ways)', 'address-word-tag'],
    'tag': ['address-word-set']
};*/
this.formulas = {
    'ways': ['pow(-set+log(cache)-log(block))'],
    'cache': ['pow(set+log(block)+log(ways))'],
    'memory': ['pow(address)'],
    'block': ['pow(word)', 'pow(-set+log(cache)-log(ways))'],
    'address': ['log(memory)', 'word+set+tag'],
    'word': ['log(block)', 'address-set-tag'],
    'set': ['log(cache)-log(block)-log(ways)', 'address-word-tag'],
    'tag': ['address-word-set']
};
break;

case 'disk':
this.formulas = {
    'transferdata': ['transfertime*(speed/60*track)/1000'],
    'totaltime': ['seektime+latencytime+transfertime'],
    'seektime': ['totaltime-latencytime-transfertime'],
    'latencytime': ['(1000/(speed/60))/2', 'totaltime-seektime-transfertime'],
    'transfertime': ['transferdata/(speed/60*track)*1000', 'totaltime-latencytime-seektime'],
    'track': ['transferdata/(speed/60*transfertime)*1000', 'memory/faces/tracks'],
    'faces': ['memory/tracks/track', '1'],
    'tracks': ['memory/faces/track'],
    'sector': ['track/sectors'],
    'sectors': ['track/sector'],
    'speed': ['transferdata/(transfertime/60*track)*1000'],
    'memory': ['track*tracks']
    
};
break;
case "pipeline":
this.formulas = {
    'conditionaljump': ['conditionalstall/(conditionalbranch-1)/conditionalsuccess'],
    'inconditionaljump': ['inconditionalstall/(inconditionalbranch-1)'],
    'conditionalsuccess': ['conditionalstall/(conditionalbranch-1)/conditionaljump'],
    'conditionalbranch': ['(conditionalstall/conditionaljump/conditionalsuccess)+1'],
    'inconditionalbranch': ['(inconditionalstall/inconditionaljump)+1'],
    'conditionalstall': ['(conditionalbranch-1)*conditionaljump*conditionalsuccess'],
    'inconditionalstall': ['(inconditionalbranch-1)*inconditionaljump'],
    'branches': ['performance*(1+conditionalstall+inconditionalstall)'],
    'performance': ['1/(1+conditionalstall+inconditionalstall)*branches']
};
break;
}
};
solver.prototype.check = function(formula){
    if (isNumber(this.formulas[formula]))
        return false;
    for (m in this.formulas[formula])
    {
        notdefined = false;
        strings = this.formulas[formula][m].match(/[a-z]+/gi);
        //print('CHECK:' + strings);
        for (i in strings)
            if (strings[i]!='log' && strings[i]!='pow')
                if (!isNumber(this.formulas[strings[i]]))
                    notdefined = true;
        if (!notdefined)
            return m;
    }              
    return false;
};
solver.prototype.evaluate = function(formula){
    formula = formula.replace(/([a-z]+)/gi, 'this.formulas[\'$1\']');
    formula = formula.replace(/this\.formulas\['pow'\]/g, 'pow');
    formula = formula.replace(/this\.formulas\['log'\]/g, 'log');
    //print(formula);
    return eval(formula);
};
solver.prototype.solve = function(data){
    for (i in data)
        this.formulas[i] = data[i];
        
    for (x=0; x<20; x++)
    {
        var change = false;
        for (n in this.formulas)
        {
            //print(n + ': ' + this.formulas[n]);
            var t = this.check(n);
            if (isNumber(t))
            {
                change = true;
                this.formulas[n] = this.evaluate(this.formulas[n][t]);
            }
            //print(n + ': ' + this.formulas[n]);
        }
        if (change==false)
            break;
            
    }
};
solver.prototype.show = function(){
    for (n in this.formulas)
    {
        if (isNumber(this.formulas[n]))
         print(n + ': ' + this.formulas[n]);       
    }
};


print("N-Ways 1");

e1 = new solver('nways');
e1.solve({
'ways': 8, 'cache': toInt("4KB"), 'memory': toInt("1MB"), 'block': toInt("64B")
});
e1.show();
print("\n");

print("N-Ways 2");

e2 = new solver('nways');
e2.solve({
'ways': 4, 'cache': toInt("1KB"), 'tag': 12, 'block': toInt("32B")
});
e2.show();
print("\n");

print("N-Ways 3");

e3 = new solver('nways');
e3.solve({
'ways': 4, 'cache': toInt("4KB"), 'memory': toInt("256KB"), 'block': toInt("64B")
});
e3.show();
print("\n");

print("Disk 1");

e4 = new solver('disk');
e4.solve({
'transferdata': toInt("64KB"), 'totaltime': 9.728571, 'tracks': 524288, 'sector': toInt("512B"), 'seektime': 0.8, 'speed': 4200
});
e4.show();
print("\n");

print("Disk 2");

e5 = new solver('disk');
e5.solve({
'memory': toInt("512GB"), 'transferdata': toInt("32KB"), 'tracks': 524288, 'sectors': 1024, 'seektime': 1.4, 'speed': 10000, 'faces': 8
});
e5.show();
print("\n");

print("Disk 3");

e6 = new solver('disk');
e6.solve({
'memory': toInt("128GB"), 'totaltime': 11.728571, 'tracks': 65536, 'sectors': 2048, 'seektime': 2.8, 'speed': 4200, 'faces': 4
});
e6.show();
print("\n");

print("Direct 1");

e7 = new solver('direct');
e7.solve({
'address': 32, 'cache': 16, 'block': 1});
e7.show();
print("\n");

print("Direct 2");

e8 = new solver('direct');
e8.solve({
'cache': 8, 'block': 1});
e8.show();
print("");
e8 = new solver('direct');
e8.solve({
'cache': 8, 'block': 2});
e8.show();
print("");
e8 = new solver('direct');
e8.solve({
'cache': 8, 'block': 4});
e8.show();
print("\n");

print("N-Ways 4");

e7 = new solver('nways');
e7.solve({
'ways': 2, 'address': 32, 'cache': 16, 'block': 1, 'blocksperline': 1});
e7.show();
print("\n");

print("Conversion 1");
hex = "30E5C";
print(hex + ": " + hexToBin(hex, 15));
hex = "17A87";
print(hex + ": " + hexToBin(hex, 15));
print("\n");

print("Float conversion 1");
print("0 111 1011 => " + binToFloat ("01111011", 3, 4) );
print("1 100 1011 => " + binToFloat ("11001011", 3, 4) );
print("0 101 1111 => " + binToFloat ("01011111", 3, 4) );
print("1 111 1111 => " + binToFloat ("11111111", 3, 4) );
print("0 101 1011 => " + binToFloat ("01011011", 3, 4) );
print("0 110 1111 => " + binToFloat ("01101111", 3, 4) );
print("2.3 => " + floatToBin ("2.3", 3, 4) );
print("-0.25 => " + floatToBin ("-0.25", 3, 4) );
print("6.5 => " + floatToBin ("6.5", 3, 4) );
print("2.25 => " + floatToBin ("2.25", 3, 4) );
print("-7.3 => " + floatToBin ("-7.3", 3, 4) );
print("2.625 => " + floatToBin ("2.625", 3, 4) );
print("-4.75 => " + floatToBin ("-4.75", 3, 4) );
print("0.40625 => " + floatToBin ("0.40625", 3, 4) );
print("-12.0 => " + floatToBin ("-12.0", 3, 4) );
print("1.7 => " + floatToBin ("1.7", 3, 4));
print("\n");

print("Pipeline 1");
e8 = new solver('pipeline');
e8.solve({
'branches': 4, 'conditionaljump': '0.15', 'inconditionaljump': 0.01, 'conditionalsuccess': 0.6, 'conditionalbranch': 3, 'inconditionalbranch': 2 });
e8.show();
print("\n");



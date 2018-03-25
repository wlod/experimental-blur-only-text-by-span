function CircleBlurShape(elementId) {
    this.elementId = elementId;
    this.circleR = null;
    this.circleRSquared = null;
    this.circleX0 = null;
    this.circleY0 = null;

    var __construct = function() {
     	let element = document.getElementById(elementId);

     	if (!element) {
	        throw new Error("Can not find element by id: " + elementId);
	    }

     	let domRectCircle = element.getBoundingClientRect();
		this.circleR = domRectCircle.width/2;
		this.circleRSquared = circleR * circleR;
		this.circleX0 = domRectCircle.x + circleR;
		this.circleY0 = domRectCircle.y + circleR;

    }(this);

    this.inShape = function(x, y) {
    	var distancesquared = (x - circleX0) * (x - circleX0) + (y - circleY0) * (y - circleY0);
  		return distancesquared <= circleRSquared;
    }
    
};

function SpanCharacter(parentNode, spanNode) {
    this.parentNode = parentNode;
    this.spanNode = spanNode;
};


function appendBlur(elementToBlurId, shapeOfblurId) {

	let elementToBlur = document.getElementById(elementToBlurId);

 	if (!elementToBlur) {
        throw new Error("Can not find element by id: " + elementToBlurId);
    }

    // TODO shape factory
	var blurShape = new CircleBlurShape(shapeOfblurId);

	let spanCharacterToReplaceList = new Array();
	replaceCharactersInTextNodeToSpan(elementToBlur, spanCharacterToReplaceList);


	 for(let i = 0; i < spanCharacterToReplaceList.length; i++) {
    	let spanCharacter = spanCharacterToReplaceList[i];
    	let domRect = spanCharacter.spanNode.getBoundingClientRect()
		let elementX1 = domRect.x;
		let elementY1 = domRect.y;

		let elementX1WithWidth = domRect.x + domRect.width;
		let elementY1WithHeight = domRect.y + domRect.height;

		if( blurShape.inShape(elementX1, elementY1) &&
			blurShape.inShape(elementX1WithWidth, elementY1) &&
			blurShape.inShape(elementX1, elementY1WithHeight) &&
			blurShape.inShape(elementX1WithWidth, elementY1WithHeight)
			) {
			spanCharacter.spanNode.className += " blur";
		}
    }
}

function replaceCharactersInTextNodeToSpan(node, spanCharacterToReplaceList) {

    applyNodeToReplace(node, spanCharacterToReplaceList)
    
    for(let i = 0; i < spanCharacterToReplaceList.length; i++) {
    	let spanCharacter = spanCharacterToReplaceList[i];
    	spanCharacter.parentNode.appendChild(spanCharacter.spanNode);
    }

}

function applyNodeToReplace(node, spanCharacterToReplaceList) {
	
    let nodes = node.childNodes;
    for (let i = 0; i < nodes.length; i++) {
        let innerNode = nodes[i];

        if (innerNode.nodeType === Node.TEXT_NODE) {

            if (innerNode.nodeValue.trim().length === 0) {
                continue;
            }
           
            for(let i = 0; i < innerNode.nodeValue.length; i++) {
            	let spanNode = document.createElement("span");
            	spanNode.textContent = innerNode.nodeValue[i];
            	spanCharacterToReplaceList.push(new SpanCharacter(innerNode.parentNode, spanNode));
            }
 
            innerNode.nodeValue = null;
            continue;
        }

        applyNodeToReplace(innerNode, spanCharacterToReplaceList);
    }

    return;
}
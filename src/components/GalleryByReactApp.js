'use strict';

var React = require('react/addons');

// CSS
require('normalize.css');
require('../styles/main.less');

// 获取图片数据
var imageDatas = require('../data/imagesData.json');

// 利用自执行函数。将图片信息转化为图片URL路径信息
imageDatas = (function genImageURL(imageDatasArr){
	for (var i = 0; i < imageDatasArr.length; i++) {
		var singleImageData = imageDatasArr[i];

		singleImageData.imageURL = require('../images/' + singleImageData.fileName);

		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);

/*
 *获取区间的随机值
 */
function getRangeRandom(low, high){
	return Math.ceil(Math.random() * (high - low) + low);
}

/*
 *获取角度为0-30；
 */
function get30rotate(){
    return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}
var ImgFigure = React.createClass({
	/*
	 *imgFigure的点击处理函数
	 */
	handleClick: function(e){
		if(this.props.arrange.iscenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
		e.stopPropagation();
		e.preventDefault();
	},

	render: function(){

		var styleObj = {};

		// 如果props属性中指定了这张图片等的位置
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}

		// 如果图片旋转角度有值，并不为0，添加旋转角度
		if(this.props.arrange.rotate){
			(['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function (value) {
				styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			}.bind(this));
		}

		if(this.props.arrange.iscenter){
			styleObj.zIndex = 11;
		}
		var ImgFigureClassName = 'img-figure';
		ImgFigureClassName += this.props.arrange.isInverse ? ' is-inverse ' : '';

		return (
				<figure className={ImgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
				<h2 className="img-title">{this.props.data.title}</h2>
				<div className="img-back" onClick={this.handleClick}>
				<p>{this.props.data.desc}</p>
				</div>
				</figcaption></figure>

			);
	}
});

// 控制组装件
var ControllerUnits = React.createClass({
	handleClick: function(e){

		// 如果点击的是当前居中态的图片，则翻转图片，负责居中对应的图片
		if(this.props.arrange.iscenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
		e.preventDefault();
		e.stopPropagation();
	},
	render: function () {
		var controllerUnitsClassName = 'controller-units';

		// 如果对应的是居中的图片，显示控制按钮的居中态
		if(this.props.arrange.iscenter){
			controllerUnitsClassName += ' is-center';

			// 如果同时对应的是反转图片，显示控制按钮的翻转状态
			if(this.props.arrange.isInverse){
				controllerUnitsClassName += ' is-inverse';
			}
		}
		return (
				<span className={controllerUnitsClassName} onClick={this.handleClick}></span>
			);
	}
});

var GalleryByReactApp = React.createClass({
	Constant: {
		centerPos: {
			left: 0,
			right: 0
		},
		hPosRange: {
			leftSecX: [0, 0],
			rightSecX: [0, 0],
			y: [0, 0]
		},
		vPosRange: {
			x: [0, 0],
			topY: [0, 0]
		}
	},
	/*
	 *反转图片
	 *@param index  输入当前执行isInverse操作的图片对应图片信息数组的index值
	 *@retuen {Funtion} 这是一个闭包函数，期内return一个真正待执行的函数
	 */
	inverse: function(index){
		return function() {
			var imgsArrangeArr = this.state.imgsArrangeArr;

			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});

		}.bind(this);
	},

	/*
	 *重新布局所有图片
	 *@param centerIndex指定居中排布那个图片
	 */
	rearrange: function(centerIndex){
		var imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,

			imgsArrangeTopArr = [],
			topImgNum = Math.floor(Math.random() * 2),
			// 取一个或者不取
			topImgSpliceIndex = 0,
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

			// 首先居中centerIndex的图片
			imgsArrangeCenterArr[0] = {
				pos: centerPos,
				rotate: 0,
				iscenter: true
			};
			// 取出要布局上侧的图片信息
			topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
			imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
			// 布局位于上侧的图片
			imgsArrangeTopArr.forEach(function(value, index){
				imgsArrangeTopArr[index] = {
					pos: {
						top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
						left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
					},
					rotate: get30rotate(),
					iscenter: false
				};
			});

			// 布局左右两侧的图片
			for(var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++){
				var hPosRangeLORX = null;

				// 前半部分布局左边，后半部分布局右边
				if(i < k){
					hPosRangeLORX = hPosRangeLeftSecX;
				}else{
					hPosRangeLORX = hPosRangeRightSecX;
				}

				imgsArrangeArr[i] = {
					pos: {
						top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
						left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
					},
					rotate: get30rotate(),
					iscenter: false
				};
			}

			if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
				imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
			}

			imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});

	},

	/*
	 *利用rearrange函数，居中对应的index的图片
	 *@param index 需要被居中的图片对应的图片信息数组的index值
	 *@return {Function}
	 */
	center: function(index){
		return function(){
			this.rearrange(index);
		}.bind(this);
	},

	getInitialState: function(){
		return {
			imgsArrangeArr: [
				/*{
					pos:{
						left:'0',
						top:'0'
					},
					rotate: k,
					isInverse: false,
					iscenter: false
				}*/
			]
		};
	},
// 组件加载以后，为每张图片计算其位置
	componentDidMount: function(){

		// 拿到舞台的大小
		var stageDOM = React.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);

		// 拿到一个imageFigure的大小
		var ImgFigureDOM = React.findDOMNode(this.refs.ImgFigure0),
			imgW = ImgFigureDOM.scrollWidth,
			imgH = ImgFigureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);

		// 计算中心区域的位置点
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		};

		// 计算左右侧图片排布取值范围
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;

		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;

		// 计算上侧区域图片排布的位置取值范围
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;
		this.rearrange(0);
	},


  render: function(){

	var controllerUnits = [];
	var ImgFigures = [];

	imageDatas.forEach(function(value, index){

		if(!this.state.imgsArrangeArr[index]){
			this.state.imgsArrangeArr[index] = {
				pos: {
					left: 0,
					top: 0
				},
				rotate: 0,
				isInverse: false,
				iscenter: false
			};
		}
		ImgFigures.push(<ImgFigure key={index} data={value} ref={'ImgFigure' + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
		controllerUnits.push(<ControllerUnits key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
	}.bind(this));
    return (
      <section className="stage" ref="stage">
      <section className="img-sec">
      {ImgFigures}
      </section>
      <nav className="controller-nav">
      {controllerUnits}
      </nav>
      </section>
    );
  }
});
React.render(<GalleryByReactApp />, document.getElementById('content')); // jshint ignore:line

module.exports = GalleryByReactApp;

'use strict';

var React = require('react/addons');

// CSS
require('normalize.css');
require('../styles/main.less');

// 获取图片数据
var imageDatas = require('../data/imagesData.json');

// 利用自执行函数。将图片信息转化为图片URL路径信息
imageDatas = (function genImageURL(imageDatasArr){
	for (var i = 0; i<imageDatasArr.length; i++) {
		var singleImageData = imageDatasArr[i];

		singleImageData.imageURL = require('../images/'+singleImageData.fileName);

		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr
})(imageDatas);

var GalleryByReactApp = React.createClass({
  render: function() {
    return (
      <section className="stage">
       		<section className="img-sec">
       		</section>
       		<nav className="controller-nav">
       		</nav>
      </section>
    );
  }
});
React.render(<GalleryByReactApp />, document.getElementById('content')); // jshint ignore:line

module.exports = GalleryByReactApp;

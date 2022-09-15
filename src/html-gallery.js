/*
MIT License

Copyright (c) 2022 Johan Strydom

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const galleries = [];

class HtmlGallery{
        constructor(options) {
            const _G = this;

            galleries.push(this);

            _G.key = galleries.length;
            _G.id = 'gallery-' + _G.key;
            _G.gallery = null;
            _G.base = 'images/';
            _G.baseThumbs = 'images/thumbs/';
            _G.basePreview = 'images/preview/';
            _G.images = [];
            _G.autoLoad = false;

            //TODO: Different aspect ratios and devices
            _G.previewWidth = 1024;
            _G.previewHeight = 768;

            _G.lastLoadIterator = -1;

            _G.lightbox = document.createElement("div");
            _G.lightbox.id = 'gallery-' + _G.key + '-lightbox';
            _G.lightbox.classList.add("lightbox");
            _G.lightbox.classList.add("hide");

            _G.imgPreview = document.createElement("div");
            _G.imgPreview.id = 'gallery-' + _G.key + '-img-preview';
            _G.imgPreview.classList.add("img-preview");
            _G.imgPreview.classList.add("hide");

            _G.imgLoader = document.createElement("div");
            _G.imgLoader.classList.add("loader");
            _G.imgLoader.classList.add("hide");

            _G.imgPreview.appendChild(_G.imgLoader);

            _G.previewImg = new Image();
            _G.previewImg.classList.add("preview-img");
            _G.previewImg.classList.add("hide");
            _G.previewImg.onclick = function(){return false;}

            _G.previewImg.onload = function(){
                _G.imgLoader.classList.add("hide");
                _G.previewImg.classList.remove("hide");
            }

            _G.imgPreview.appendChild(_G.previewImg);

            _G.lightbox.onclick = function(){
                
                _G.lightbox.classList.add("hide");
                _G.imgPreview.classList.add("hide");
                _G.imgPreview.classList.remove("flex");
            }

            let firstChild = document.body.firstChild;
            document.body.insertBefore(_G.lightbox, firstChild);
            document.body.insertBefore(_G.imgPreview,firstChild);

            console.log( document.body.offsetWidth + "x" + document.body.offsetHeight );
           
            _G.imgPreview.style.top = ( ( document.body.offsetHeight - (_G.previewHeight + 20) ) / 2 ) + "px";
            _G.imgPreview.style.left = ( ( document.body.offsetWidth - _G.previewWidth ) / 2 ) + "px";
            

            if(typeof options != 'undefined'){

                if(typeof options.id != 'undefined'){
                    _G.id = options.id;
                    _G.gallery = document.getElementById(_G.id);
                }

                if(typeof options.base != 'undefined'){
                    _G.base = options.base;
                }

                if(typeof options.images != 'undefined'){
                    _G.images = options.images;
                    _G.baseThumbs = _G.base + 'thumbs/';
                    _G.basePreview = _G.base + 'preview/';
                }

                if(typeof options.autoLoad != 'undefined'){
                    _G.autoLoad = options.autoLoad;
                }
            }

            if(_G.gallery==null){
                _G.gallery = document.createElement("div");
                _G.gallery.id=_G.id;
                _G.gallery.classList.add("html-gallery");
                document.body.appendChild(_G.gallery);
            }

            _G.PreviewImage = function(img){

                _G.previewImg.classList.add("hide");

                _G.lightbox.classList.remove("hide");
                _G.imgPreview.classList.remove("hide");
                _G.imgLoader.classList.remove("hide");

                _G.imgPreview.classList.add("flex");

                _G.previewImg.src = _G.base + img;
            }

            _G.LoadImage = function(img, callback){

                const a =  document.createElement('a');
                a.href = _G.base + img;
                a.target = "_new";
                a.classList.add("img-url");
                a.onclick=function(){
                    _G.PreviewImage(img);
                    return false;
                }

                const elImg = new Image();                
                elImg.onload = function(){
                    a.appendChild(elImg);
                    _G.gallery.appendChild(a);
                    callback();
                };
                elImg.src = _G.baseThumbs + img;
            }

            _G.LoadNextImage = function(){
                _G.lastLoadIterator++;
                if(_G.lastLoadIterator >= _G.images.length){ _G.lastLoadIterator--; return; }
                _G.LoadImage(_G.images[_G.lastLoadIterator],_G.LoadNextImage);
            }

            if(_G.autoLoad){
                _G.LoadNextImage();
            }

        }
}
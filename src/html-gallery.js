const galleries = [];

class HtmlGallery{
        constructor(options) {
            const _G = this;

            galleries.push(this);

            _G.id = 'gallery-' + galleries.length;
            _G.gallery = null;
            _G.base = 'images/';
            _G.images = [];
            _G.autoLoad = false;

            _G.lastLoadIterator = -1;

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
                }

                if(typeof options.autoLoad != 'undefined'){
                    _G.autoLoad = options.autoLoad;
                }
            }

            if(_G.gallery==null){
                _G.gallery = document.createElement("div");
                _G.gallery.id=_G.id;
                document.body.appendChild(_G.gallery);
            }

            _G.LoadImage = function(img, callback){

                const a =  document.createElement('a');
                a.href = _G.base + img;
                a.target = "_new";

                const elImg = new Image();                
                elImg.onload = function(){
                    a.appendChild(elImg);
                    _G.gallery.appendChild(a);
                    callback();
                };

                elImg.src = _G.base + 'thumbs/' + img;
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
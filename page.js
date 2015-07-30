var wow = (function(wow) {
  var Page = function(clickFn, maxSize, prevText, nextText, currentClz, noPageClz) {
    this.clickFn = clickFn || this.clickFn || function(){};
    if(!maxSize || maxSize < 3) {
      this.maxSize = 7;
    } else {
      this.maxSize = (maxSize % 2 === 0) ? (maxSize + 1) : maxSize;  // 使用奇数
    }

    this.prevText = prevText;
    this.nextText = nextText;
    this.currentClz = currentClz;
    this.noPageClz = noPageClz;

    this.pageElement = document.createElement('ul');
    this.pageElement.classList.add('page');
    this.pageElement.addEventListener('click', function(e) {
      var tgt = e.target;
      if(tgt.classList.contains(currentClz) || tgt.classList.contains(noPageClz) || tgt.classList.contains('page')) {
        return;
      }

      clickFn.call(null, parseInt(tgt.dataset.page));
    });

    this.decorate(1, 1);
  };

  Page.create = function(clickFn, opt) {
    var opt = opt || {};
    opt.maxSize = opt.maxSize || 7;
    opt.prevText = opt.prevText !== undefined ? opt.prevText : '\u4e0a\u4e00\u9875';
    opt.nextText = opt.nextText !== undefined ? opt.nextText : '\u4e0b\u4e00\u9875';
    opt.currentClz = opt.currentClz || 'current';
    opt.noPageClz = opt.noPageClz || 'no-page';

    var page = new Page(clickFn, opt.maxSize, opt.prevText, opt.nextText, opt.currentClz, opt.noPageClz);
    return page;
  };

  Page.prototype = {
    decorate: function(index, total) {
      if(!index || index < 1) {
        this.index = 1;
      } else {
        this.index = index;
      }

      if(!total || total < 1) {
        this.total = 1;
      } else {
        this.total = total;
      }

      var setFirst = this.maxSize - 2,
          setLast = total - (this.maxSize - 2) + 1;

      var pageEle = this.pageElement,
          prevEle = null,
          nextEle = null;
      pageEle.innerHTML = '';

      prevEle = this.createPageItem('prev');
      pageEle.appendChild(prevEle);

      var i = 1,
          item = null;
      if(total <= this.maxSize) {   // 可以全部显示页数
        for(i = 1, len = total; i <= len; i++) {
          item = this.createPageItem(i);
          pageEle.appendChild(item);
        }
      } else {
        if(index <= this.maxSize - 3) {  // 后面带省略
          for(i = 1; i <= this.maxSize - 2; i++) {
            item = this.createPageItem(i);
            pageEle.appendChild(item);
          }

          pageEle.appendChild(this.createPageItem('more'));
          pageEle.appendChild(this.createPageItem(total));
        } else if(index >= total - (this.maxSize - 2) + 2) {   // 前面带省略
          pageEle.appendChild(this.createPageItem(1));
          pageEle.appendChild(this.createPageItem('more'));
          for(i = total - (this.maxSize - 2) + 1; i <= total; i++) {
            item = this.createPageItem(i);
            pageEle.appendChild(item);
          }
        } else {  // 前后都带省略
          pageEle.appendChild(this.createPageItem(1));
          pageEle.appendChild(this.createPageItem('more'));
          pageEle.appendChild(this.createPageItem(index - 1));
          pageEle.appendChild(this.createPageItem(index));
          pageEle.appendChild(this.createPageItem(index + 1));
          pageEle.appendChild(this.createPageItem('more'));
          pageEle.appendChild(this.createPageItem(total));
        }
      }

      nextEle = this.createPageItem('next');
      pageEle.appendChild(nextEle);

      return pageEle;
    },
    createPageItem: function(page) {
      var item = document.createElement('li');
      if(page === 'next') {
        item.innerText = this.nextText;
        item.classList.add('page-next');
        if(this.index == this.total) {
          item.classList.add(this.noPageClz);
        } else {
          item.dataset.page = this.index + 1;
        }
      } else if (page === 'prev') {
        item.innerText = this.prevText;
        item.classList.add('page-prev');
        if(this.index == 1) {
          item.classList.add(this.noPageClz);
        } else {
          item.dataset.page = this.index - 1;
        }
      } else if (page === 'more') {
        item.innerText = '...';
        item.dataset.page = '';
        item.classList.add(this.noPageClz);
      } else {
        item.innerText = page;
        item.dataset.page = page;
        if(this.index == page) {
          item.classList.add(this.currentClz);
        }
      }

      return item;
    }
  };

  wow.Page = Page;
  return wow;
})(wow || {});
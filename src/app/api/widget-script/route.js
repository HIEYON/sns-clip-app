// 카페24 쇼핑몰에 삽입되는 위젯 스크립트
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mallId = searchParams.get('mall_id');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  const script = `
(function() {
  'use strict';
  var MALL_ID = '${mallId}';
  var API_URL = '${appUrl}/api/widget-data?mall_id=' + MALL_ID;

  var style = document.createElement('style');
  style.textContent = [
    '.snsc-wrap{width:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;padding:2.4rem 0;box-sizing:border-box}',
    '.snsc-wrap *{box-sizing:border-box;margin:0;padding:0}',
    '.snsc-title{font-size:1.6rem;font-weight:700;color:#111;margin-bottom:1.4rem;padding:0 1.6rem}',
    '.snsc-scroll{display:flex;gap:1rem;overflow-x:auto;padding:0 1.6rem 1rem;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none}',
    '.snsc-scroll::-webkit-scrollbar{display:none}',
    '.snsc-card{flex:0 0 17rem;scroll-snap-align:start;position:relative;border-radius:1.2rem;overflow:hidden;cursor:pointer;background:#000;aspect-ratio:9/16}',
    '.snsc-card video,.snsc-card img{width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;transition:transform 0.3s}',
    '.snsc-card:hover video,.snsc-card:hover img{transform:scale(1.04)}',
    '.snsc-card-info{position:absolute;bottom:0;left:0;right:0;padding:2.4rem 1rem 1rem;background:linear-gradient(transparent,rgba(0,0,0,0.65));color:#fff;font-size:1.2rem}',
    '.snsc-card-info .handle{font-weight:600;font-size:1.3rem}',
    '.snsc-card-info .caption{margin-top:0.3rem;opacity:0.85;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;line-height:1.4;font-size:1.1rem}',
    '.snsc-play-icon{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:4rem;height:4rem;background:rgba(255,255,255,0.85);border-radius:50%;display:flex;align-items:center;justify-content:center;transition:opacity 0.2s}',
    '.snsc-play-icon svg{width:1.6rem;height:1.6rem;fill:#111;margin-left:3px}',
    '.snsc-modal{display:none;position:fixed;inset:0;z-index:99999;background:#000}',
    '.snsc-modal.open{display:flex}',
    '.snsc-close{position:absolute;top:1.6rem;right:1.6rem;z-index:10;width:3.6rem;height:3.6rem;background:rgba(255,255,255,0.15);border:none;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)}',
    '.snsc-close svg{width:2rem;height:2rem;stroke:#fff;fill:none;stroke-width:2.5}',
    '.snsc-viewer{width:100%;height:100%;overflow-y:scroll;scroll-snap-type:y mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none}',
    '.snsc-viewer::-webkit-scrollbar{display:none}',
    '.snsc-slide{width:100%;height:100vh;scroll-snap-align:start;position:relative;display:flex;align-items:center;justify-content:center;background:#000}',
    '.snsc-slide video{width:100%;height:100%;object-fit:contain;display:block}',
    '.snsc-slide-info{position:absolute;bottom:0;left:0;right:0;padding:4rem 1.6rem 3rem;background:linear-gradient(transparent,rgba(0,0,0,0.7));color:#fff}',
    '.snsc-slide-info .handle{font-weight:700;font-size:1.5rem}',
    '.snsc-slide-info .handle::before{content:"@";font-size:1.3rem;opacity:0.7;margin-right:2px}',
    '.snsc-slide-info .caption{margin-top:0.6rem;font-size:1.3rem;line-height:1.5;opacity:0.9}',
    '.snsc-insta-link{display:inline-flex;align-items:center;gap:0.4rem;margin-top:1rem;color:#fff;font-size:1.2rem;text-decoration:none;opacity:0.75;border-bottom:1px solid rgba(255,255,255,0.4);padding-bottom:1px}',
    '.snsc-nav{position:absolute;top:50%;right:1.6rem;transform:translateY(-50%);display:flex;flex-direction:column;gap:1rem;z-index:10}',
    '.snsc-nav button{width:3.6rem;height:3.6rem;background:rgba(255,255,255,0.15);border:none;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)}',
    '.snsc-nav svg{width:2rem;height:2rem;stroke:#fff;fill:none;stroke-width:2.5}',
    '@media(max-width:768px){.snsc-card{flex:0 0 14rem}.snsc-nav{display:none}}'
  ].join('');
  document.head.appendChild(style);

  function buildWidget(videos) {
    if (!videos || videos.length === 0) return;

    var wrap = document.createElement('div');
    wrap.className = 'snsc-wrap';
    wrap.innerHTML =
      '<div class="snsc-title">✨ 인플루언서 PICK</div>' +
      '<div class="snsc-scroll" id="snscGallery"></div>';

    var modal = document.createElement('div');
    modal.className = 'snsc-modal';
    modal.id = 'snscModal';
    modal.innerHTML =
      '<button class="snsc-close" id="snscClose"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
      '<div class="snsc-viewer" id="snscViewer"></div>' +
      '<div class="snsc-nav"><button id="snscUp"><svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg></button><button id="snscDown"><svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></button></div>';

    // 배송정보 섹션 뒤에 삽입
    var target = document.querySelector('.xans-product-detail') ||
                 document.querySelector('.product-detail') ||
                 document.querySelector('#product_detail') ||
                 document.querySelector('.prd-detail');
    if (!target) return;
    target.parentNode.insertBefore(wrap, target.nextSibling);
    document.body.appendChild(modal);

    var gallery = document.getElementById('snscGallery');
    var viewer = document.getElementById('snscViewer');
    var slides = [];
    var currentIdx = 0;

    videos.forEach(function(v, i) {
      // 갤러리 카드
      var card = document.createElement('div');
      card.className = 'snsc-card';
      card.innerHTML =
        (v.thumb_url
          ? '<img src="' + v.thumb_url + '" alt="' + (v.handle || '') + '" loading="lazy">'
          : '<video src="' + v.src_url + '" muted preload="metadata" playsinline></video>') +
        '<div class="snsc-play-icon"><svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>' +
        '<div class="snsc-card-info">' +
          '<div class="handle">@' + (v.handle || '') + '</div>' +
          '<div class="caption">' + (v.caption || '') + '</div>' +
        '</div>';
      card.addEventListener('click', function() { openModal(i); });
      gallery.appendChild(card);

      // 쇼츠 슬라이드
      var slide = document.createElement('div');
      slide.className = 'snsc-slide';
      slide.dataset.index = i;
      slide.innerHTML =
        '<video src="' + v.src_url + '" playsinline loop muted preload="none"></video>' +
        '<div class="snsc-slide-info">' +
          '<div class="handle">' + (v.handle || '') + '</div>' +
          '<div class="caption">' + (v.caption || '') + '</div>' +
          (v.insta_url ? '<a class="snsc-insta-link" href="' + v.insta_url + '" target="_blank" rel="noopener">인스타에서 보기</a>' : '') +
        '</div>';
      viewer.appendChild(slide);
      slides.push(slide);
    });

    function openModal(idx) {
      currentIdx = idx;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      slides[idx].scrollIntoView({ behavior: 'instant', block: 'start' });
      var video = slides[idx].querySelector('video');
      if (video) video.play().catch(function(){});
    }

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      slides.forEach(function(s) {
        var v = s.querySelector('video');
        if (v) { v.pause(); v.currentTime = 0; }
      });
    }

    document.getElementById('snscClose').addEventListener('click', closeModal);
    document.getElementById('snscUp').addEventListener('click', function() {
      if (currentIdx > 0) slides[--currentIdx].scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    document.getElementById('snscDown').addEventListener('click', function() {
      if (currentIdx < slides.length - 1) slides[++currentIdx].scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    document.addEventListener('keydown', function(e) {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowDown' && currentIdx < slides.length - 1) slides[++currentIdx].scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (e.key === 'ArrowUp' && currentIdx > 0) slides[--currentIdx].scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        var video = entry.target.querySelector('video');
        if (!video) return;
        if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
          currentIdx = parseInt(entry.target.dataset.index);
          video.play().catch(function(){});
        } else {
          video.pause();
        }
      });
    }, { root: viewer, threshold: 0.6 });
    slides.forEach(function(s) { observer.observe(s); });
  }

  // 페이지 로드 후 데이터 가져와서 위젯 렌더링
  function init() {
    fetch(API_URL)
      .then(function(r) { return r.json(); })
      .then(function(data) { buildWidget(data.videos); })
      .catch(function(e) { console.warn('인별위젯 로드 실패:', e); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
`;

  return new Response(script, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

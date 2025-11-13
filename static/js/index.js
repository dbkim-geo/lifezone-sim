// 페이지 전환
$('#btn-current').click(() => window.location.href = '/current');
$('#btn-simulation').click(() => window.location.href = '/simulation');

// 패럴랙스 효과 (마우스 움직임)
const svg = document.getElementById('map-svg');
const shadow = document.getElementById('map-shadow');
const container = document.querySelector('.right-panel');

container.addEventListener('mousemove', e => {
    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // svg: 마우스 반대 방향 / shadow: 같은 방향
    svg.style.transform = `translate(${-x * 30}px, ${-y * 30}px)`;
    shadow.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
});


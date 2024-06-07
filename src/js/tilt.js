function setTiltEffect(element, tiltEffectSettings) {
  // im'a let some other chump organize this code. oh wait, its a solo project :(
  const card = element;
  document.addEventListener("mouseenter", cardMouseEnter);
  document.addEventListener("mousemove", cardMouseMove);
  document.addEventListener("mouseleave", cardMouseLeave);

  function cardMouseEnter(event) {
    setTransition();
  }

  function cardMouseMove(event) {
    const cardWidth = card.offsetWidth;
    const cardHeight = card.offsetHeight;
    const centerX = card.offsetLeft + cardWidth / 2;
    const centerY = card.offsetTop + cardHeight / 2;
    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;
    const rotateXUncapped =
      +1 * ((tiltEffectSettings.max * mouseY) / (cardHeight / 2));
    const rotateYUncapped =
      -1 * ((tiltEffectSettings.max * mouseX) / (cardWidth / 2));
    const rotateX =
      rotateXUncapped < -tiltEffectSettings.max
        ? -tiltEffectSettings.max
        : rotateXUncapped > tiltEffectSettings.max
        ? tiltEffectSettings.max
        : rotateXUncapped;
    const rotateY =
      rotateYUncapped < -tiltEffectSettings.max
        ? -tiltEffectSettings.max
        : rotateYUncapped > tiltEffectSettings.max
        ? tiltEffectSettings.max
        : rotateYUncapped;

    card.style.transform = `perspective(${tiltEffectSettings.perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) 
                          scale3d(${tiltEffectSettings.scale}, ${tiltEffectSettings.scale}, ${tiltEffectSettings.scale})`;
  }

  function cardMouseLeave(event) {
    setTransition();
  }

  function setTransition() {
    clearTimeout(card.transitionTimeoutId);
    card.style.transition = `transform ${tiltEffectSettings.speed}ms ${tiltEffectSettings.easing}`;
    card.transitionTimeoutId = setTimeout(() => {
      card.style.transition = "";
    }, tiltEffectSettings.speed);
  }
}
setTiltEffect(document.getElementsByClassName("lin-inn")[0], {
  max: 3,
  perspective: 1500,
  scale: 1.0,
  speed: 500,
  easing: "cubic-bezier(.03,.98,.52,.99)",
});

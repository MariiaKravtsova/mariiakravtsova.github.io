$("document").ready(function() {
  handleTyping();
});

function handleTyping () {
  $(".element").typed({
    strings: ["a software engineer in training.", "a space nerd.", "a bookworm.", "a Machine Learning explorer."],
    typeSpeed: 50,
    starDelay: 200,
    backDelay: 600,
    loop: true,
    showCursor: true,
    cursorChar: "|"
  });
}

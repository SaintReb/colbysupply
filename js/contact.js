document.getElementById('contactForm').addEventListener('submit',async(e)=>{
e.preventDefault();
await fetch('/api/contact',{method:'POST',body:new FormData(e.target)});
alert('Submitted');
});
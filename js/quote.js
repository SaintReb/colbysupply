document.getElementById('quoteForm').addEventListener('submit',async(e)=>{
e.preventDefault();
await fetch('/api/quote',{method:'POST',body:new FormData(e.target)});
alert('Submitted');
});
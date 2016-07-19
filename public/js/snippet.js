function showForm(){
  var formArt = document.getElementById("formArt");
  formArt.style.display = (formArt.style.display === "none")? "block": "none";
}

$("#submit").submit(function(event){
    alert("Catched");
    return false;
});

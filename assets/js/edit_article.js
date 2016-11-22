function submitEditPost(details)
{
  $.ajax({
    url: "/post/edit",
    method: "POST",
    data: details,
    success: function(data)
    {
      window.location.replace('/'+details.id)
    },
    error: function(data)
    {
      window.location.replace('/')
    }
  })
}

$(document).ready(function()
{
  $("form#edit_article").on("submit", function(e)
  {
    e.preventDefault()
    var details = $(this).serializeArray()
      .reduce(function(a, x) { a[x.name] = x.value; return a }, {})

    submitEditPost(details)
  })
})

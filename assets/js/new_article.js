function submitEditPost(details)
{
  $.ajax({
    url: "/post/new",
    method: "POST",
    data: details,
    success: function(data)
    {
      window.location.replace('/'+data.seo_name)
    },
    error: function(data)
    {
      window.location.replace('/')
    }
  })
}

$(document).ready(function()
{
  $("form#new_article").on("submit", function(e)
  {
    e.preventDefault()
    var details = $(this).serializeArray()
      .reduce(function(a, x) { a[x.name] = x.value; return a }, {})

    submitEditPost(details)
  })
})

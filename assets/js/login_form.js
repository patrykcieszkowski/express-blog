"use strict"

// Options for Message
//----------------------------------------------
var options = {
  'btn-loading': '<i class="fa fa-spinner fa-pulse"></i>',
  'btn-success': '<i class="fa fa-check"></i>',
  'btn-error': '<i class="fa fa-remove"></i>',
  'msg-success': 'All Good! Redirecting...',
  'msg-error': 'Wrong login credentials!',
  'useAJAX': true,
}

// Loading
//----------------------------------------------
function remove_loading($form)
{
	$form.find('[type=submit]').removeClass('error success')
	$form.find('.login-form-main-message').removeClass('show error success').html('')
}

function form_loading($form)
{
  $form.find('[type=submit]').addClass('clicked').html(options['btn-loading'])
}

function form_success($form)
{
  $form.find('[type=submit]').addClass('success').html(options['btn-success'])
  $form.find('.login-form-main-message').addClass('show success').html(options['msg-success'])
}

function form_failed($form)
{
	$form.find('[type=submit]').addClass('error').html(options['btn-error'])
	$form.find('.login-form-main-message').addClass('show error').html(options['msg-error'])
}

function submit_login(login, pass, $form)
{
  $.ajax({
    url: "/login",
    method: "POST",
    data: {
      login: login,
      password: pass
    },
    beforeSend: form_loading($form),
    success: function(data)
    {
      form_success($form)
      window.location.replace('/')
    },
    error: function(data)
    {
      form_failed($form)
    }
  })
}

$(document).ready(function()
{
  $("#login-form").validate({
  	rules: {
      lg_username: "required",
  	  lg_password: "required",
    },
  	errorClass: "form-invalid"
  })

  $("#login-form").on('submit', function(e)
  {
    e.preventDefault()
  	remove_loading($(this))
    var details = $(this).serializeArray()
      .reduce(function(a, x) { a[x.name] = x.value; return a }, {})

  	if (options['useAJAX'] == true)
  	{
      submit_login(details.lg_username, details.lg_password, $(this))
  	}
  })
})

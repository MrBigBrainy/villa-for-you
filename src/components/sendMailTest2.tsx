import React from 'react'
const resend = new Resend('re_UwxDd8mT_GNAM2JPQWtSaJynRWxaUSU81');

resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'mrbigbrainy@gmail.com',
  subject: 'Hello World',
  html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
});

function sendMailTest2() {
  return (
    <div>sendMailTest2</div>
  )
}

export default sendMailTest2
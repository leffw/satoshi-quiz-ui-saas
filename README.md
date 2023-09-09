# Satoshi Quiz 
![](./demo.png)

This is the user interface (UI) for the Satoshi Quiz platform. It offers a wide range of features so that users can manage their Quizzes efficiently. With this UI, it is possible to create new Quizzes, list the existing ones, delete them and even finance the sats portfolio directly within the application. With an intuitive and functional interface, users can enjoy a practical and convenient experience when using the Satoshi Quiz platform.

### Customization of Quizzes Parameters

Want to customize your Quizzes? No problem! Just add the
parameters below in the query:

- `?bg=red`: This parameter allows you to change the background color of the Quiz to red.
- `?colorButton=red`: Use this parameter to color Quizzes buttons.
- `?bgButtonCorrectAnswer=yellow`: This parameter is responsible for changing the background color when the user answers correctly.
- `?user=XYZ`: Use this parameter to pass the Memberstack's user identifier, preventing other users from receiving funds other than the users registered in the Memberstack configured in the account.

Example: https://localhost:58341/71e27272-aab2-41f5-b72c-6638fe2b0aed?user=123782X8SA9DASX&bg=red

### Embedding the Quiz in a Wireframe

- Access your Satoshi Quiz account and create a new quiz.
- Access the created Quiz and get the URL

```hml
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Satoshi Quiz</title>
    <style>
        body {
            background: rgb(2,0,36);
            background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%);
            margin: 0; /* Remove margin to fill the entire page */
        }

        .iframe-container {
            width: 100%; /* Use 100% of the page width */
            height: 100vh; /* Use 100% of the viewport height */
        }

        iframe {
            width: 100%;
            height: 100%;
            border: none; /* Remove iframe border */
        }
    </style>
</head>
<body>
    <div class="iframe-container">
        <iframe src="https://satoshi-quiz-ui-saas.vercel.app/14ac742a-bee4-48af-a82b-6c3fdac055c2?user=xpto" frameborder="0" scrolling="no"></iframe>
    </div>
</body>
</html>
```

If you are using and configured memberstack you can pass the user identifier in the `?user=` of the iframe url.
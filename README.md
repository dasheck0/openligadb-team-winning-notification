# OpenLiga DB Team Winning Notification
<!-- section: Introduction -->
<!-- Describe briefly what your software is. What problem does it solve? At what target audience is it aimed? -->

This is a lambda function that sends you an email when you favorite club has won in the last week. This is especially useful, when you are currently disappointed by your team and only want to hear from them if the won (like me at the moment). It uses [OpenLigaDB](https://www.openligadb.de/) as API. See the website for relevant IDs in your .env file

## Development
<!-- section: Development -->
<!-- If you software is developed within a team you shhould include this section. Describe how to setup thhe project. Include dependencies, conventions and other things to know in order to start developing. In short: After reading this section everyone should be able to develop this piece of software. -->
<!--
Possible subsections

### How to setup and run this project
### Commit messages
### How to publish a release
### Tests
-->
The following environment data is required:

| Name        | Description                                                     |
| ----------- | --------------------------------------------------------------- |
| COMPETITION | Identifier for competition to get (i.e. `bl1` for Bundesliga)   |
| SEASON      | Identifier for season to get (i.e. `2021` for season 2ß21/2022) |
| TEAMID      | Identifier for team to get (i.e. `7` for Borussia Dortmund)     |
| RECIPIENT   | Recipient email adress to whom the mail is sent                 |
| SOURCE      | Email adress from whom the mail was sent                        |

Run `npm i` and `npm pack:clean` for creating the bundle. Create an AWS Lambda function and apply a role including the SESFullAccess policy. You might want to restrict this. Upload the bundle and override basic configuration (i.e. max execution time) when needed. Set the einvorment data described above with the desired values. Run a test to see whether it is working.

Go to Cloudwatch and create a rule with a cron pattern (e.g. `0 6 ? * MON *` for every monday 6 am UTC) and set your lambda as target. Done!

## Contributing
<!-- section: Contributing -->
<!-- Describe what action one should take in order to contribute. Does a certain styleguide has to be adhered. How can one apply changes (i.e. push vs. pull request)? -->
Bug reports and pull requests are welcome on GitHub at https://github.com/dasheck0/openligadb-team-winning-notification/issues. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the Contributor Covenant code of conduct.

## License
<!-- section: License -->
<!-- Describe the license under which your software is published. Note that an unlicensed piece of software is most likely never used. So do not skip tihs part! -->
```
MIT License Copyright (c) 2021 Stefan Neidig

Permission is hereby granted, free
of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use, copy, modify, merge,
publish, distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to the
following conditions:

The above copyright notice and this permission notice
(including the next paragraph) shall be included in all copies or substantial
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
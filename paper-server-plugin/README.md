## How to build and use a new version of the server plugin

1. From the plugin project root directory, run:

```bash
./gradlew build
```
2. In the project root, navigate to build/libs/ and locate the generated .jar file.

3. Open your server using FileZilla or another FTP client and upload the .jar file into the plugins/ directory.

4. RRestart the Minecraft server and check the logs for the plugin startup message:
```bash
[PigeonPost] PigeonPost enabled
```
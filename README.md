# Tiny but powerful cross-platform C/C++ compiler (Actually it's a preprocessor)

## Table of contents

- [Why](#why) 
- [Should you use it in your project?](#should-i-use) 
- [How?](#how?) 
  - [Build or download an executable.](#build) 
  - [Set it up](#setup) 
  - [Use it](#use) 
  - [Configuration example](#config-example) 
- [Configuration options](#config-options) 
  - [include](#config-options-include)
  - [libs](#config-options-libs)
  - [libFolder](#config-options-lib-folder)
  - [flags](#config-options-flags)
  - [std](#config-options-std)
  - [main (Required)](#config-options-main)
  - [autoSrc](#config-options-auto-src)
  - [src](#config-options-src)
  - [srcDir](#config-options-src-dir)
  - [copy](#config-options-copy)
  - [out (Required)](#config-options-out)
- [CLI options](#cli-options) 
  - [version](#cli-options-version)
  - [directory](#cli-options-directory)
  - [task](#cli-options-task)
  - [config](#cli-options-config)
  - [os](#cli-options-os)
- [Contributing](#contribute) 
- [Future](#future-plans) 


<a id="why">

## Why?

</a>

I tired of using heavy IDEs or describing many project solutions for different platforms such as make, CMake, VS solutions, etc.

I tired of using IDEs that I don't like.

Have you ever thought about having a single entry point for whatever platform you're working on?

Or about working in your favorite IDE on your project on any platform?

Here is a solution!


`So, TCPP is a cross-platform preprocessor for Gcc/G++ compiler.`


<a id="should-i-use">

## Should you use it in your project?

</a>

The answer is quite simple - yes!

Because it was built over the Gcc/G++ compiler.

If you are prefer to use GCC(Unix, Macos is also UNIX), Mingw or Cygwin (Windows), then you can use my preprocessor to create a platform independent project configuration.

<a id="how">

## How?

</a>

<a id="build">

### Build or download an executable.

</a>

Before you build an app, you should have the `Nodejs` installed on your machine.

To build, run the following commands:
```shell
npm i -g pkg // To install a Nodejs application compiler.
npm i // To install dependencies
npm run dist // To build sources, run tests and create executables
```

<a id="setup">

### Set it up

</a>

To set up a preprocessor, just move the build executable in the folder whatever you want and add the program path to the environment variable.
Or, just copy it to the root folder of your project.

<a id="use">

### Use it

</a>

It's very easy and fun to use it.

First of all, create a configuration json file that contais a list of tasks to run.
```json
// config.json
{
  "task01": {...},
  "buildTask": {...},
  "platformSpecificOne": {
    "windows": {...},
    "windows64": {...},
    "linux": {...},
    "android": {...}
  }
}
```

As you can see, it can also contain a platform specific options.

Note: You can describe any configuration property in platform specific way if you want!

For now, the app contains the following platform keywords:

1. windows
2. windows64
3. linux
4. android
5. ios
6. mac

You can specify a platform while running a build process, or the app will choose it itself depending on your operating system.

I'll show you all the available(and required) options next.

For now, let's imagine that you filled the configuration out. And now is time to run.

To run just call the following command:
```shell
# Windows
./tcpp -t yourTaskName

# Linux, MacOS, or if you added it to the environment on Windows
tcpp -t yourTaskName
```

That's all that you need to compile your app!

<a id="config-example">

### Configuration example

</a>

Now, I'll show you a configuration for the mario game, that is placed under `cpp/mario` folder.

<details>
  <summary>Config example</summary>

```json
{
  "build": {
    "include": {
      "windows64": [
        "3rdParty/SDL2/x86_64-w64-mingw32/include/SDL2",
        "3rdParty/SDL2_image/x86_64-w64-mingw32/include/SDL2",
        "3rdParty/SDL2_mixer/x86_64-w64-mingw32/include/SDL2"
      ],
      "windows": [
        "3rdParty/SDL2/i686-w64-mingw32/include/SDL2",
        "3rdParty/SDL2_image/i686-w64-mingw32/include/SDL2",
        "3rdParty/SDL2_mixer/i686-w64-mingw32/include/SDL2"
      ]
    },
    "libs": [
      "mingw32",
      "SDL2main",
      "SDL2",
      "SDL2_image",
      "SDL2_mixer"
    ],
    "libFolder": {
      "windows64": [
        "3rdParty/SDL2/x86_64-w64-mingw32/lib",
        "3rdParty/SDL2_image/x86_64-w64-mingw32/lib",
        "3rdParty/SDL2_mixer/x86_64-w64-mingw32/lib"
      ],
      "windows": [
        "3rdParty/SDL2/i686-w64-mingw32/lib",
        "3rdParty/SDL2_image/i686-w64-mingw32/lib",
        "3rdParty/SDL2_mixer/i686-w64-mingw32/lib"
      ]
    },
    "flags": [],
    "std": "c++11",
    "main": "src/main.cpp",
    "srcDir": "src",
    "autoSrc": true,
    "copy": {
      "windows64": [
        "assets/files",
        "3rdParty/SDL2/x86_64-w64-mingw32/bin/*",
        "3rdParty/SDL2_image/x86_64-w64-mingw32/bin/*",
        "3rdParty/SDL2_mixer/x86_64-w64-mingw32/bin/*"
      ],
      "windows": [
        "assets/files",
        "3rdParty/SDL2/i686-w64-mingw32/bin/*",
        "3rdParty/SDL2_image/i686-w64-mingw32/bin/*",
        "3rdParty/SDL2_mixer/i686-w64-mingw32/bin/*"
      ]
    },
    "out": {
      "base": {
        "windows": "windowsOut",
        "windows64": "windows64Out"
      },
      "name": "mario",
      "target": "exe"
    }
  }
}
```

As you can see, it contains settings for 2 types of Windows platform (x86 and x64)
It should be very easy to understand what is going on here, but anyway, I'll describe all the available options next :)
</details>

<a id="config-options">

## Configuration options

</a>

Want to remember, each option can be defined in a platform specific way.


<a id="config-options-include">

### iclude

</a>

String or Array that defines one or multiple include folders.


<a id="config-options-libs">

### libs

</a>

String or Array that defines one or multiple libraries that will be linked to your app.

Remember, order is important!


<a id="config-options-lib-folder">

### libFolder

</a>

String or Array that defines one or multiple library folders that will be used to search libraries for.


<a id="config-options-flags">

### flags

</a>

An array of additional flags that will be appended to the compilation command.


<a id="config-options-std">

### std

</a>

String, helps to set C/C++ std version, also can bee defined throught the `flags` parameter.


<a id="config-options-main">

### main (Required)

</a>

String, use it to set the entry point of your programm.

App will use it to parse a tree of sources/headers that you programm requires.


<a id="config-options-auto-src">

### autoSrc

</a>

Boolean, set `true` if you want compiler to automaticaly collect all the source files throught the project tree.

<a id="config-options-src">

### src

</a>

String or Array that defines one or multiple source files that will be compiled together with a main file.

If `autoSrc` is true then will use current parameter value as a list of additional sources to compile with.



<a id="config-options-src-dir">

### srcDir

</a>

String, available to use with `autoSrc` parameter, tells the compiler to search for sources in the current directory, may be useful when you don't want the app to search for the sources in the full project directory list.




<a id="config-options-copy">

### copy

</a>

String or Array that defines one or multiple resources that should be moved to the build directory.

Also, directory regexp is accesable here:
- `assets/images` - will copy whole images folder with it children into the build directory
- `assets/images/*` - will copy all the files inside images directory and spread into the build directory


<a id="config-options-out">

### out (Required)

</a>

Required object, that contains a few suboptions:

- `base` - output directory
- `name` - result app name
- `target` - result app extension



<a id="cli-options">

## CLI option

</a>


<a id="cli-options-version">

### --version, -v

</a>

Returns app version


<a id="cli-options-directory">

### --directory, -d

</a>

Specifies directory to parse project in


<a id="cli-options-task">

### --task, -t (Required)

</a>

Specifies task to execute


<a id="cli-options-config">

### --config, -c

</a>

Specifies path to the config file


<a id="cli-options-os">

### --os

</a>

Specifies operating system to build.

Available values: `windows, windows64, linux, android, ios, mac`




<a id="contribute">

## Contributing

</a>

Thank you, my future contributor, I'll be glad to see any of your activity, starting from filing a GitHub issue or making a proposal for a feature and finishing with submitting a Pull Request.


<a id="future-plans">

## Future plans

</a>

- [x] Basic C/C++ compiling
- [ ] Static/dynamic libraries compiling
- [ ] Move project to the TypeScript
- [ ] Preprocessing by chaining tasks
- [ ] Optimized compiling (chunks compiling, doesn't compile parts that wasn't changed, etc.)
- [ ] Generate solutions for popular build systems (Cmake, make, Visual Studio, Android Studio)
- [ ] Hot reloading
- [ ] Inject a C/C++ test engine into the system
- [ ] Preprocessing with custom, user defined, JavaScript modules (example: for documentation generation)
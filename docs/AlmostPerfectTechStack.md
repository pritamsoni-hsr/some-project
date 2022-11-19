## Almost perfect tech stack for building a next gen startup.

![Tech Stack Mess](https://miro.medium.com/max/4800/1*H0HyjqcT6baLOum8136TDw.jpeg)

in all of this mess, what should be the next stack of my application, so many options, this is what looks promising to
me for my next application.

### backend:

go, grpc, postgres.

### frontend:

flutter — works on mobile(android and ios), and dart has grpc client when building flutter for mobile, but it doesn’t
work out of the box for flutter on web. there are some tweaks that needs to be performed to make it work on web, but I
believe web and mobile codebase should be different. They are just completely different things, we don’t have powerful
css selectors in flutter(or react native) like we do have on web (if you find something, send in a PR to update this
doc please).

For using the grpc on web, I see these 3 promising packages,

- [official grpc web repo](https://github.com/grpc/grpc-web)
- [Improbable](https://github.com/improbable-eng/grpc-web)
- [connect-web](https://github.com/bufbuild/connect-web) buf team — I have not tried this yet, but this is from the
  same team that released [buf](https://docs.buf.build/introduction) amazing protobuf utility package.

but I have this idea where I can expose grpc client compiled on WASM and exported so that it can be called in JS
without needing anything like it.


### IaC:
Terraform, I have not yet played with pulumi much to comment on it for a large project.

Or if you are just starting, cloud run is pretty good to get started.

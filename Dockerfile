FROM rust:latest

ARG UNAME
ARG UID
ARG GID

ENV USER=$UNAME

ENV CARGO_HOME /home/$UNAME/.cargo
ENV PATH $PATH:/usr/local/bin:$CARGO_HOME/bin

RUN groupadd --gid $UID $UNAME \
  && useradd --uid $UID --gid $GID -m $UNAME \
  && apt -y update && apt install -y sudo \
  && echo $UNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$UNAME \
  && chmod 0440 /etc/sudoers.d/${UNAME}

RUN apt -y update && apt -y install npm && npm install -g npm@latest typescript

USER $UNAME

WORKDIR /app
RUN cargo install cargo-edit cargo-generate
RUN rustup component add rls rust-analysis rust-src
RUN cargo install wasm-pack
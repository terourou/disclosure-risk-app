FROM rocker/r-ver:4.2

LABEL org.label-schema.license="GPL-2.0" \
      org.label-schema.vcs-url="https://github.com/terourou/disclosure-risk-app" \
      maintainer="Tom Elliott <tom.elliott@auckland.ac.nz>"

RUN apt-get update -qq \
    && install2.r Rserve

COPY dependencies.txt ./

RUN install2.r "$(cat dependencies.txt)"

COPY . .

# get PORT from environment, default to 8081
ARG PORT=8081
ENV PORT=${PORT}
EXPOSE ${PORT}

CMD ["Rscript", "start.R"]

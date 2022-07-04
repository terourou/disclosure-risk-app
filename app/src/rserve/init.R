wrap.js.fun <- function(s)
{
  if (class(s) != "javascript_function")
    stop("Can only wrap javascript_function s");
  function(...) {
    Rserve::self.oobMessage(list(s, ...))
  }
}

wrap.r.fun <- Rserve:::ocap

## load functionality from modular files:
MODULE_DIR <- file.path(getwd(), "modules")
use_module <- function(name, env = new.env()) {
    mod_file <- sprintf("%s/%s.R", MODULE_DIR, name)
    if (!file.exists(mod_file)) return(list())

    source(mod_file, local = env)

    lapply(as.list(env),
        function(x) {
        if (is.function(x)) wrap.r.fun(x) else x
        }
    )
}

give.first.functions <- function()
{
    tmp_data <- list()
    list(
        # return contexted functions with 'data' object available
        upload_data = wrap.r.fun(function(x = NULL) {
            if (!is.null(x)) {
              tmp_data <<- c(tmp_data, list(as.data.frame(x)))
              return(TRUE)
            }
            user_data <- data.table::rbindlist(tmp_data)
            use_module("DisclosureRisk", environment())
        })
    )
}

####################################################################################################
# make.oc turns a function into an object capability accessible from the remote side

# oc.init must return the first capability accessible to the remote side
oc.init <- function()
{
  wrap.r.fun(give.first.functions)
}

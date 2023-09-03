disRiskVar <- function(samp.frac, p.vec, dr = NA){ 
  if(length(p.vec) != 3){ #If p.vec does not have 3 values in it, the function will stop
    stop("p.vec is not of length 3")
  }
  if(samp.frac <= 0 || samp.frac > 1){#If samp.frac, the sampling fraction, is 0 or less, or greater than 1, the function will stop.
    stop("samp.frac is not between 0 and 1")
  }
  if(is.na(dr) == T){ #If dr is NA, will calculate dr, a little hackyish way of providing the option to define dr or not.
    dr = (p.vec[1] * samp.frac) / (p.vec[1] * samp.frac + p.vec[2] * (1 - samp.frac))
  }
  v = dr^2*(2*(1-samp.frac)*(3*(1-samp.frac)*p.vec[3])+(2-samp.frac)*p.vec[2])/(samp.frac*p.vec[1] + (2*(1-samp.frac)*p.vec[2]))^2
  data.frame("Disclosure Risk" = dr, Variance = v, "Lower Bound" = dr-1.96*sqrt(v), "Upper Bound" = dr+1.96*sqrt(v))
}

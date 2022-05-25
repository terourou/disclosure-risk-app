library(shiny)
library(markdown)
library(dplyr)
library(sdcMicro)
ui <- navbarPage("Ahh", 
                 tabPanel("File Upload",
                          sidebarPanel(
                            
                            # Input: Select a file ----
                            fileInput("file1", "Choose CSV File",
                                      multiple = FALSE,
                                      accept = c("text/csv",
                                                 "text/comma-separated-values,text/plain",
                                                 ".csv")),
                            
                            # Horizontal line ----
                            tags$hr(),
                            
                            # Input: Checkbox if file has header ----
                            checkboxInput("header", "Header", TRUE),
                            
                            # Input: Select separator ----
                            radioButtons("sep", "Separator",
                                         choices = c(Comma = ",",
                                                     Semicolon = ";",
                                                     Tab = "\t"),
                                         selected = ","),
                            
                            # Input: Select quotes ----
                            radioButtons("quote", "Quote",
                                         choices = c(None = "",
                                                     "Double Quote" = '"',
                                                     "Single Quote" = "'"),
                                         selected = '"'),
                            
                            # Horizontal line ----
                            tags$hr(),
                            
                            # Input: Select number of rows to display ----
                            radioButtons("disp", "Display",
                                         choices = c(Head = "head",
                                                     All = "all"),
                                         selected = "head")),
                          mainPanel(
                            tableOutput("uploadFile")
                          )
                 ),
                 tabPanel("Inputs", 
                          titlePanel("Disclosure Risk App"),
                          column(width = 6,
                                 selectInput("nvars", "Number of Variables",
                                             choices = c(3:10)
                                 ),
                                 
                                 conditionalPanel(
                                   condition = "input.nvars >  2",
                                   textInput("v1", "Variable 1:",
                                             value = "")
                                 ),
                                 conditionalPanel(
                                   condition = "input.nvars >  2",
                                   textInput("v2", "Variable 2:",
                                             value = "")
                                 ),
                                 conditionalPanel(
                                   condition = "input.nvars >  2",
                                   textInput("v3", "Variable 3:",
                                             value = "")
                                 ),
                                 conditionalPanel(
                                   condition = "input.nvars > 3",
                                   textInput("v4", "Variable 4:",
                                             value = "")
                                 ),
                                 conditionalPanel(
                                   condition = "input.nvars > 4",
                                   textInput("v5", "Variable 5:",
                                             value = "")
                                 ),
                                 conditionalPanel(
                                   condition = "input.nvars > 5",
                                   textInput("v6", "Variable 6:",
                                             value = "")
                                 ),
                                 conditionalPanel(
                                   condition = "input.nvars > 6",
                                   textInput("v7", "Variable 7:",
                                             value = "")
                                 ),
                                 conditionalPanel(
                                   condition = "input.nvars > 7",
                                   textInput("v8", "Variable 8:",
                                             value = "")
                                 ),
                                 conditionalPanel(
                                   condition = "input.nvars > 8",
                                   textInput("v9", "Variable 9:",
                                             value = "")
                                 ),
                                 conditionalPanel(
                                   condition = "input.nvars > 9",
                                   textInput("v10", "Variable 10:",
                                             value = "")
                                 ),
                                 textOutput("varError"),
                                 textOutput("missingError")
                                 
                          ),
                          column(width = 6,
                                 textInput("f", "Population Estimate or Sampling Fraction",
                                           value = ""),
                                 conditionalPanel(
                                   condition = "input.nvars >  2",
                                   textInput("m1", "Missing 1:",
                                             value = "")
                                 ),
                                 conditionalPanel(
                                   condition = "input.nvars >  2",
                                   textInput("m2", "Missing 2:",
                                             value = "")
                                 ),
                                 conditionalPanel(
                                   condition = "input.nvars >  2",
                                   textInput("m3", "Missing 3:",
                                             value = "")
                                 ),
                                 conditionalPanel(
                                   condition = "input.nvars > 3",
                                   textInput("m4", "Missing 4:",
                                             value = "")
                                 ),
                                 conditionalPanel(
                                   condition = "input.nvars > 4",
                                   textInput("m5", "Missing 5:",
                                             value = "")
                                 ),
                                 conditionalPanel(
                                   condition = "input.nvars > 5",
                                   textInput("m6", "Missing 6:",
                                             value = "")
                                 ),
                                 conditionalPanel(
                                   condition = "input.nvars > 6",
                                   textInput("m7", "Missing 7:",
                                             value = "")
                                 ),
                                 conditionalPanel(
                                   condition = "input.nvars > 7",
                                   textInput("m8", "Missing 8:",
                                             value = "")
                                 ),
                                 conditionalPanel(
                                   condition = "input.nvars > 8",
                                   textInput("m9", "Missing 9:",
                                             value = "")
                                 ),
                                 conditionalPanel(
                                   condition = "input.nvars > 9",
                                   textInput("m10", "Missing 10:",
                                             value = "")
                                 ),
                                 actionButton(
                                   "submit", "Start Analysis"
                                 )
                          )
                          
                          #uiOutput("ui")
                 ),
                 tabPanel("Results",
                          dataTableOutput("filled"))
)
server <- function(input, output, session) {
  v <- reactiveValues(button = 0)
  output$uploadFile <- renderTable({
    
    # input$file1 will be NULL initially. After the user selects
    # and uploads a file, head of that data file by default,
    # or all rows if selected, will be shown.
    
    req(input$file1)
    
    # when reading semicolon separated files,
    # having a comma separator causes `read.csv` to error
    tryCatch(
      {
        df <- read.csv(input$file1$datapath,
                       header = input$header,
                       sep = input$sep,
                       quote = input$quote)
      },
      error = function(e) {
        # return a safeError if a parsing error occurs
        stop(safeError(e))
      }
    )
    
    if(input$disp == "head") {
      return(head(df))
    }
    else {
      return(df)
    }
    
  })
  
  varsDef <- eventReactive(input$submit, {
    vars <- c(input$v1, input$v2, input$v3, input$v4, input$v5, input$v6, input$v7, input$v8, input$v9, input$v10)
    selVars <- vars[which(vars != "")] #Variables vector
    if(sum(vars[1:input$nvars] == "") > 0 ){ #If any of the available variable boxes to fill in are not filled in make statement they are not
      whichVars <- which(vars[1:input$nvars] == "")
      paste(c("Variable(s) ", whichVars, "not inputted correctly"), collapse = " ")
    }
  }
  )
  output$varError <- renderText({varsDef()})
  
  missingDef <- eventReactive(input$submit, {
    missing <- c(input$m1, input$m2, input$m3, input$m4, input$m5, input$m6, input$m7, input$m8, input$m9, input$m10)
    selMissing <- missing[which(missing != "")] #Variables vector
    if(sum(missing[1:input$nvars] == "") > 0 ){ #If any of the available variable boxes to fill in are not filled in make statement they are not
      whichMissing <- which(missing[1:input$nvars] == "")
      paste(c("Missing Value(s) ", whichMissing, "not inputted correctly"), collapse = " ")
    }
  }
  )
  output$missingError <- renderText({missingDef()})
  
  filled <- eventReactive(input$submit, {
    disRisk <- function(sampFrac, cVec){
      nUni <- cVec[1]
      nPair <- cVec[2]
      (nUni * sampFrac)/(nUni * sampFrac + nPair * (1 - sampFrac))
    }
    
    filledDataFrame <- data.frame(V1 = as.character(input$v1),
                                  V2 = as.character(input$v2),
                                  V3 = as.character(input$v3),
                                  V4 = as.character(input$v4),
                                  V5 = as.character(input$v5),
                                  V6 = as.character(input$v6),
                                  V7 = as.character(input$v7),
                                  V8 = as.character(input$v8),
                                  V1 = as.character(input$v9),
                                  V10 = as.character(input$v10),
                                  M1 = as.character(input$m1),
                                  M2 = as.character(input$m2),
                                  M3 = as.character(input$m3),
                                  M4 = as.character(input$m4),
                                  M5 = as.character(input$m5),
                                  M6 = as.character(input$m6),
                                  M7 = as.character(input$m7),
                                  M8 = as.character(input$m8),
                                  M1 = as.character(input$m9),
                                  M10 = as.character(input$m10),
                                  f2 = as.numeric(input$f),
                                  stringsAsFactors = F
    )
    
    data <- data.frame(input$file1, stringsAsFactors = F)
    
    vars <- c(filledDataFrame$V1,
              filledDataFrame$V2,
              filledDataFrame$V3,
              filledDataFrame$V4,
              filledDataFrame$V5,
              filledDataFrame$V6,
              filledDataFrame$V7,
              filledDataFrame$V8,
              filledDataFrame$V9,
              filledDataFrame$V10
    )
    
    missing <- c(filledDataFrame$M1,
                 filledDataFrame$M2,
                 filledDataFrame$M3,
                 filledDataFrame$M4,
                 filledDataFrame$M5,
                 filledDataFrame$M6,
                 filledDataFrame$M7,
                 filledDataFrame$M8,
                 filledDataFrame$M9,
                 filledDataFrame$M10
    )
    selVars <- vars[which(vars != "")] #Variables vector
    selMiss <- as.character(missing[which(vars != "")]) #Missing values vector
    remove <- c() #Initialising the observations we are going to remove
    #Need to turn any vars with NA into 
    for(j in 1:length(selVars)){
      if(sum(is.na(data[selVars[j]])) >= 1){
        data[which(is.na(data[,selVars[j]]) == T), selVars[j]] <- "NA"
      }
      if(selMiss[j] != ""){
        # if(is.na(selMiss[j]) == T){
        #   data[,selVars[j]][which(is.na(data[selVars[j]]) == T)] <- "NA"
        # }
        missVals <- unlist(strsplit(selMiss[j], "&"))
        for(k in 1:length(missVals)){ #For the individual missing values i.e. if missings are NA and 1 and 2, then for each of NA, 1, and 2
          remove <- union(which(data[,selVars[j]] == missVals[k]), remove) #Union of the previous missing values and the additional missing values, giving us a new vector of observations to remove
        }
      }
    }
    
    filledDataFrame$SS <- nrow(data)
    
    filledDataFrame$NVar <- length(selVars)
    filledDataFrame$NR <- length(remove) #Number removed
    
    data <- data[setdiff(1:nrow(data), remove),]
    if(length(vars[which(vars != "")]) == 1){
      data <- data.frame(as.character(data[ , which(colnames(data) %in% vars[which(vars != "")])]))
      colnames(data) <- selVars
    }
    if(length(vars[which(vars != "")]) > 1){
      data <- data.frame(apply(data[ , which(colnames(data) %in% vars[which(vars != "")])], 2, as.character))
    }
    
    #New Sample Size
    filledDataFrame$SSR <- nrow(data)
    
    #Finding npairs, doubles and trips
    uniqueCombos <- group_by_all(data) %>%
      dplyr::count()
    counts <- c(sum(uniqueCombos$n == 1), sum(uniqueCombos$n == 2), sum(uniqueCombos$n == 3))
    
    #Disclosure risks, DIS and SUDA2
    filledDataFrame$NU <- counts[1]
    filledDataFrame$NP <- 2*counts[2]
    filledDataFrame$NT <- 3*counts[3]
    sdc_data <- createSdcObj(data, keyVars = selVars)
    filledDataFrame$DR2 <- disRisk(filledDataFrame$SS/filledDataFrame$f2, counts[1:3])
      if(filledDataFrame$NU == 0 && filledDataFrame$NP == 0){
        filledDataFrame$DR2 <- 0
        filledDataFrame$DRR2 <- 0
      }
      suda2Vals <- suda2(sdc_data, DisFraction = filledDataFrame$SS/filledDataFrame$f2)@risk$suda2
      sudaSummary <- summary(suda2Vals$disScore)
      filledDataFrame$Suda2Min <- sudaSummary[1]
      filledDataFrame$Suda2Median <- sudaSummary[3]
      filledDataFrame$Suda2Mean <- sudaSummary[4]
      filledDataFrame$Suda2Max <- sudaSummary[6]
  filledDataFrame
  }
  )
  
  output$filled <- renderDataTable({filled()})
  
}

shinyApp(ui, server)

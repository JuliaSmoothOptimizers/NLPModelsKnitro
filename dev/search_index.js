var documenterSearchIndex = {"docs":
[{"location":"reference/#Reference","page":"Reference","title":"Reference","text":"","category":"section"},{"location":"reference/","page":"Reference","title":"Reference","text":"​","category":"page"},{"location":"reference/#Contents","page":"Reference","title":"Contents","text":"","category":"section"},{"location":"reference/","page":"Reference","title":"Reference","text":"​","category":"page"},{"location":"reference/","page":"Reference","title":"Reference","text":"Pages = [\"reference.md\"]","category":"page"},{"location":"reference/","page":"Reference","title":"Reference","text":"​","category":"page"},{"location":"reference/#Index","page":"Reference","title":"Index","text":"","category":"section"},{"location":"reference/","page":"Reference","title":"Reference","text":"​","category":"page"},{"location":"reference/","page":"Reference","title":"Reference","text":"Pages = [\"reference.md\"]","category":"page"},{"location":"reference/","page":"Reference","title":"Reference","text":"​","category":"page"},{"location":"reference/","page":"Reference","title":"Reference","text":"Modules = [NLPModelsKnitro]","category":"page"},{"location":"#NLPModelsKnitro.jl-documentation","page":"Home","title":"NLPModelsKnitro.jl documentation","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"This package provides a thin KNITRO wrapper for NLPModels, using jump-dev/KNITRO.jl internal structures directly.","category":"page"},{"location":"","page":"Home","title":"Home","text":"Please refer to the NLPModels documentation for the API of NLPModels, if needed.","category":"page"},{"location":"#Install","page":"Home","title":"Install","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Install NLPModelsKnitro.jl with the following commands.","category":"page"},{"location":"","page":"Home","title":"Home","text":"pkg> add NLPModelsKnitro","category":"page"},{"location":"#Contents","page":"Home","title":"Contents","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"","category":"page"},{"location":"tutorial/#Tutorial","page":"Tutorial","title":"Tutorial","text":"","category":"section"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"NLPModelsKnitro is a thin KNITRO wrapper for NLPModels. In this tutorial we show examples of problems created with NLPModels and solved with KNITRO.","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"Pages = [\"tutorial.md\"]","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"Calling KNITRO is simple:","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"`output = knitro(nlp; kwargs...)`\n\nSolves the `NLPModel` problem `nlp` using KNITRO.\n\n# Optional keyword arguments\n* `x0`: a vector of size `nlp.meta.nvar` to specify an initial primal guess\n* `y0`: a vector of size `nlp.meta.ncon` to specify an initial dual guess for the general constraints\n* `z0`: a vector of size `nlp.meta.nvar` to specify initial multipliers for the bound constraints\n* `callback`: a user-defined `Function` called by KNITRO at each iteration.\n\nFor more information on callbacks, see [https://www.artelys.com/docs/knitro/2_userGuide/callbacks.html](https://www.artelys.com/docs/knitro/2_userGuide/callbacks.html) and\nthe docstring of `KNITRO.KN_set_newpt_callback`.\n\nAll other keyword arguments will be passed to KNITRO as an option.\nSee [https://www.artelys.com/docs/knitro/3_referenceManual/userOptions.html](https://www.artelys.com/docs/knitro/3_referenceManual/userOptions.html) for the list of options accepted.","category":"page"},{"location":"tutorial/#Simple-problems","page":"Tutorial","title":"Simple problems","text":"","category":"section"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"Let's create an NLPModel for the Rosenbrock function","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"f(x) = (x_1 - 1)^2 + 100 (x_2 - x_1^2)^2","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"and solve it with KNITRO:","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"using ADNLPModels, NLPModelsKnitro\n\nnlp = ADNLPModel(x -> (x[1] - 1)^2 + 100 * (x[2] - x[1]^2)^2, [-1.2; 1.0])\nstats = knitro(nlp)\nprint(stats)","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"For comparison, we present the same problem and output using JuMP:","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"using JuMP, KNITRO\n\nmodel = Model(with_optimizer(KNITRO.Optimizer))\nx0 = [-1.2; 1.0]\n@variable(model, x[i=1:2], start=x0[i])\n@NLobjective(model, Min, (x[1] - 1)^2 + 100 * (x[2] - x[1]^2)^2)\noptimize!(model)","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"Here is an example with a constrained problem:","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"n = 10\nx0 = ones(n)\nx0[1:2:end] .= -1.2\nnlp = ADNLPModel(x -> sum((x[i] - 1)^2 + 100 * (x[i+1] - x[i]^2)^2 for i = 1:n-1), x0,\n                 x -> [3 * x[k+1]^3 + 2 * x[k+2] - 5 + sin(x[k+1] - x[k+2]) * sin(x[k+1] + x[k+2]) +\n                       4 * x[k+1] - x[k] * exp(x[k] - x[k+1]) - 3 for k = 1:n-2],\n                 zeros(n-2), zeros(n-2))\nstats = knitro(nlp, outlev=0)\nprint(stats)","category":"page"},{"location":"tutorial/#Return-value","page":"Tutorial","title":"Return value","text":"","category":"section"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"The return value of knitro is a GenericExecutionStats from SolverTools. It contains basic information on the solution returned by the solver. In addition to the built-in fields of GenericExecutionStats, we store the following subfields in the solver_specific field:","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"multipliers_con: constraints multipliers;\nmultipliers_L: variables lower-bound multipliers;\nmultipliers_U: variables upper-bound multipliers;\ninternal_msg: detailed KNITRO output message.","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"Here is an example using the constrained problem solve:","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"stats.solver_specific[:internal_msg]","category":"page"},{"location":"tutorial/#Manual-input","page":"Tutorial","title":"Manual input","text":"","category":"section"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"In this section, we work through an example where we specify the problem and its derivatives manually. For this, we need to implement the following NLPModel API methods:","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"obj(nlp, x): evaluate the objective value at x;\ngrad!(nlp, x, g): evaluate the objective gradient at x;\ncons!(nlp, x, c): evaluate the vector of constraints, if any;\njac_structure!(nlp, rows, cols): fill rows and cols with the spartity structure of the Jacobian, if the problem is constrained;\njac_coord!(nlp, x, vals): fill vals with the Jacobian values corresponding to the sparsity structure returned by jac_structure!();\nhess_structure!(nlp, rows, cols): fill rows and cols with the spartity structure of the lower triangle of the Hessian of the Lagrangian;\nhess_coord!(nlp, x, y, vals; obj_weight=1.0): fill vals with the values of the Hessian of the Lagrangian corresponding to the sparsity structure returned by hess_structure!(), where obj_weight is the weight assigned to the objective, and y is the vector of multipliers.","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"The model that we implement is a logistic regression modelq. We consider the model h(beta x) = (1 + e^-beta^Tx)^-1, and the loss function","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"ell(beta) = -sum_i = 1^m y_i ln h(beta x_i) + (1 - y_i) ln(1 - h(beta x_i))","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"with regularization lambda beta^2  2.","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"using DataFrames, LinearAlgebra, NLPModels, NLPModelsKnitro, Random\n\nmutable struct LogisticRegression <: AbstractNLPModel{Float64, Vector{Float64}}\n  X :: Matrix\n  y :: Vector\n  λ :: Real\n  meta :: NLPModelMeta{Float64, Vector{Float64}} # required by AbstractNLPModel\n  counters :: Counters # required by AbstractNLPModel\nend\n\nfunction LogisticRegression(X, y, λ = 0.0)\n  m, n = size(X)\n  meta = NLPModelMeta(n, name=\"LogisticRegression\", nnzh=div(n * (n+1), 2) + n) # nnzh is the length of the coordinates vectors\n  return LogisticRegression(X, y, λ, meta, Counters())\nend\n\nfunction NLPModels.obj(nlp :: LogisticRegression, β::AbstractVector)\n  hβ = 1 ./ (1 .+ exp.(-nlp.X * β))\n  return -sum(nlp.y .* log.(hβ .+ 1e-8) .+ (1 .- nlp.y) .* log.(1 .- hβ .+ 1e-8)) + nlp.λ * dot(β, β) / 2\nend\n\nfunction NLPModels.grad!(nlp :: LogisticRegression, β::AbstractVector, g::AbstractVector)\n  hβ = 1 ./ (1 .+ exp.(-nlp.X * β))\n  g .= nlp.X' * (hβ .- nlp.y) + nlp.λ * β\nend\n\nfunction NLPModels.hess_structure!(nlp :: LogisticRegression, rows::AbstractVector{<: Integer}, cols::AbstractVector{<: Integer})\n  n = nlp.meta.nvar\n  I = ((i,j) for i = 1:n, j = 1:n if i ≥ j)\n  rows[1 : nlp.meta.nnzh] .= [getindex.(I, 1); 1:n]\n  cols[1 : nlp.meta.nnzh] .= [getindex.(I, 2); 1:n]\n  return rows, cols\nend\n\nfunction NLPModels.hess_coord!(nlp :: LogisticRegression, β::AbstractVector, vals::AbstractVector; obj_weight=1.0, y=Float64[])\n  n, m = nlp.meta.nvar, length(nlp.y)\n  hβ = 1 ./ (1 .+ exp.(-nlp.X * β))\n  fill!(vals, 0.0)\n  for k = 1:m\n    hk = hβ[k]\n    p = 1\n    for j = 1:n, i = j:n\n      vals[p] += obj_weight * hk * (1 - hk) * nlp.X[k,i] * nlp.X[k,j]\n      p += 1\n    end\n  end\n  vals[nlp.meta.nnzh+1:end] .= nlp.λ * obj_weight\n  return vals\nend\n\nRandom.seed!(0)\n\n# Training set\nm = 1000\ndf = DataFrame(:age => rand(18:60, m), :salary => rand(40:180, m) * 1000)\ndf[!, :buy] = (df.age .> 40 .+ randn(m) * 5) .| (df.salary .> 120_000 .+ randn(m) * 10_000)\n\nX = [ones(m) df.age df.age.^2 df.salary df.salary.^2 df.age .* df.salary]\ny = df.buy\n\nλ = 1.0e-2\nnlp = LogisticRegression(X, y, λ)\nstats = knitro(nlp, outlev=0)\nβ = stats.solution\n\n# Test set - same generation method\nm = 100\ndf = DataFrame(:age => rand(18:60, m), :salary => rand(40:180, m) * 1000)\ndf[!, :buy] = (df.age .> 40 .+ randn(m) * 5) .| (df.salary .> 120_000 .+ randn(m) * 10_000)\n\nX = [ones(m) df.age df.age.^2 df.salary df.salary.^2 df.age .* df.salary]\nhβ = 1 ./ (1 .+ exp.(-X * β))\nypred = hβ .> 0.5\n\nacc = count(df.buy .== ypred) / m\nprintln(\"acc = $acc\")","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"using Plots\ngr()\n\nf(a, b) = dot(β, [1.0; a; a^2; b; b^2; a * b])\nP = findall(df.buy .== true)\nscatter(df.age[P], df.salary[P], c=:blue, m=:square)\nP = findall(df.buy .== false)\nscatter!(df.age[P], df.salary[P], c=:red, m=:xcross, ms=7)\ncontour!(range(18, 60, step=0.1), range(40_000, 180_000, step=1.0), f, levels=[0.5])\npng(\"ex3\")","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"using Plots\ngr()\n\nf(a, b) = dot(β, [1.0; a; a^2; b; b^2; a * b])\nP = findall(df.buy .== true)\nscatter(df.age[P], df.salary[P], c=:blue, m=:square)\nP = findall(df.buy .== false)\nscatter!(df.age[P], df.salary[P], c=:red, m=:xcross, ms=7)\ncontour!(range(18, 60, step=0.1), range(40_000, 180_000, step=1.0), f, levels=[0.5])","category":"page"},{"location":"tutorial/","page":"Tutorial","title":"Tutorial","text":"(Image: )","category":"page"}]
}

export class NormalDistributionService {
    standardDeviation: number;

    constructor(private mean: number, private variance: number){
        if (variance <= 0) {
            throw new Error('Variance must be > 0 (but was ' + variance + ')');
        }
        this.mean = mean;
        this.variance = variance;
        this.standardDeviation = Math.sqrt(variance);
    } 
 
    // Complementary error function
    // From Numerical Recipes in C 2e p221
    private erfc = function(x) {
        var z = Math.abs(x);
        var t = 1 / (1 + z / 2);
        var r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 +
                t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 +
                t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 +
                t * (-0.82215223 + t * 0.17087277)))))))))
        return x >= 0 ? r : 2 - r;
    };

    // Inverse complementary error function
    // From Numerical Recipes 3e p265
    private ierfc = function(x) {
        if (x >= 2) { return -100; }
        if (x <= 0) { return 100; }

        var xx = (x < 1) ? x : 2 - x;
        var t = Math.sqrt(-2 * Math.log(xx / 2));

        var r = -0.70711 * ((2.30753 + t * 0.27061) /
                (1 + t * (0.99229 + t * 0.04481)) - t);

        for (var j = 0; j < 2; j++) {
        var err = this.erfc(r) - xx;
        r += err / (1.12837916709551257 * Math.exp(-(r * r)) - r * err);
        }

        return (x < 1) ? r : -r;
    };

    private fromPrecisionMean = function(precision, precisionmean) {
        return this(precisionmean / precision, 1 / precision);
    };   

    // Probability density function
    pdf(x) {
        var m = this.standardDeviation * Math.sqrt(2 * Math.PI);
        var e = Math.exp(-Math.pow(x - this.mean, 2) / (2 * this.variance));
        return e / m;
    };

    // Cumulative density function
    cdf(x) {
        return 0.5 * this.erfc(-(x - this.mean) / (this.standardDeviation * Math.sqrt(2)));
    };

    // Percent point function
    ppf(x) {
        return this.mean - this.standardDeviation * Math.sqrt(2) * this.ierfc(2 * x);
    };

    // Product distribution of this and d (scale for constant)
    mul(d) {
        if (typeof(d) === "number") {
        return this.scale(d);
        }
        var precision = 1 / this.variance;
        var dprecision = 1 / d.variance;
        return this.fromPrecisionMean(
            precision + dprecision, 
            precision * this.mean + dprecision * d.mean);
    };

    // Quotient distribution of this and d (scale for constant)
    div(d) {
        if (typeof(d) === "number") {
        return this.scale(1 / d);
        }
        var precision = 1 / this.variance;
        var dprecision = 1 / d.variance;
        return this.fromPrecisionMean(
            precision - dprecision, 
            precision * this.mean - dprecision * d.mean);
    };

    // Addition of this and d
    add = function(d) {
        return this(this.mean + d.mean, this.variance + d.variance);
    };

    // Subtraction of this and d
    sub = function(d) {
        return this(this.mean - d.mean, this.variance + d.variance);
    };

    // Scale this by constant c
    scale = function(c) {
        return this(this.mean * c, this.variance * c * c);
    };
}
package com.algo.unionfind.percolation;

import edu.princeton.cs.algs4.StdIn;
import edu.princeton.cs.algs4.StdOut;
import edu.princeton.cs.algs4.StdRandom;
import edu.princeton.cs.algs4.StdStats;

public class PercolationStats {

    private final double percolationLog[];
    private final int trials;

    // perform trials independent experiments on an n-by-n grid
    public PercolationStats(int n, int trials) {
        if (n <= 0 || trials <= 0) throw new IllegalArgumentException();

        this.trials = trials;
        percolationLog = new double[trials];

        for (int i = 0; i < trials; i++) {
            Percolation percolation = new Percolation(n);

            double countBeforePercolates = 0;
            do {
                openNewSite(n, percolation);

                countBeforePercolates++;
            } while (!percolation.percolates());

            percolationLog[i] = countBeforePercolates / (n*n);
        }
    }

    private void openNewSite(int n, Percolation percolation) {
        int x;
        int y;
        do {
            x = StdRandom.uniform(1, n+1);
            y = StdRandom.uniform(1, n+1);
        } while (percolation.isOpen(x, y));

        percolation.open(x, y);
    }

    // sample mean of percolation threshold
    public double mean() {
        return StdStats.mean(percolationLog);
    }

    // sample standard deviation of percolation threshold
    public double stddev() {
        return StdStats.stddev(percolationLog);
    }


    private static final double CONFIDENCE_95 = 1.96;
    // low  endpoint of 95% confidence interval
    public double confidenceLo() {
        if (trials == 1) return Double.NaN;
        
        return mean() - CONFIDENCE_95*stddev() / Math.sqrt(this.trials);
    }

    // high endpoint of 95% confidence interval
    public double confidenceHi() {
        if (trials == 1) return Double.NaN;

        return mean() + CONFIDENCE_95*stddev() / Math.sqrt(this.trials);
    }

    // test client 
    public static void main(String[] args) {
        Integer n = Integer.parseInt(StdIn.readString());
        Integer trials = Integer.parseInt(StdIn.readString());

        PercolationStats stats = new PercolationStats(n, trials);

        StdOut.println("mean                    = " + stats.mean());
        StdOut.println("stddev                  = " + stats.stddev());
        StdOut.println("95% confidence low = " + stats.confidenceLo());
        StdOut.println("95% confidence high = " + stats.confidenceHi());
    }

}

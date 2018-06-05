package com.algo.unionfind.percolation;

import edu.princeton.cs.algs4.WeightedQuickUnionUF;

/**
 * By convention, the row and column indices are integers between 1 and n, where (1, 1) is the upper-left site.
 */
public class Percolation {

    private final boolean[][] sites; // true = open, false = closed
    private final WeightedQuickUnionUF unionFind;

    private int numberOfOpenSites = 0; // performance boost for test

    // create n-by-n grid, with all sites blocked
    public Percolation(int n) {
        if (n <= 0) throw new IllegalArgumentException();

        sites = new boolean[n][n];

        unionFind = new WeightedQuickUnionUF(n*n);

        for (int i = 1; i < n; i++) {
            unionFind.union(0, i);                  // union 1st row
            unionFind.union(n*n - n, n*n - n + i);  // union last row
        }
    }

    // open site (row, col) if it is not open already
    public void open(int i, int j) {
        validate(i, j);
        if (isOpen(i, j)) return;

        sites[i-1][j-1] = true;
        numberOfOpenSites++;

        unionCloseOpenSites(i, j);
    }

    private void unionCloseOpenSites(int i, int j) {
        if (i != 1 && sites[i-2][j-1]) unionFind.union(xyTo1D(i-2, j-1), xyTo1D(i-1, j-1));
        if (i != getSize() && sites[i][j-1]) unionFind.union(xyTo1D(i, j-1), xyTo1D(i-1, j-1));
        if (i != 1 && i != getSize()) { //first and last row already in union
            if (j != 1 && sites[i-1][j-2]) unionFind.union(xyTo1D(i-1, j-2), xyTo1D(i-1, j-1));
            if (j != getSize() && sites[i-1][j]) unionFind.union(xyTo1D(i-1, j), xyTo1D(i-1, j-1));
        }
    }

    // is site (row, col) open?
    public boolean isOpen(int i, int j) {
        validate(i, j);

        return sites[i-1][j-1];
    }

    // is site (row, col) full?
    public boolean isFull(int row, int col) {
        return isOpen(row, col) && unionFind.connected(0, xyTo1D(row - 1, col - 1));

    }

    // number of open sites
    public int numberOfOpenSites() {
        return numberOfOpenSites;
//        int count = 0;
//        for (int i = 0; i < getSize() - 1; i++) {
//            for (int j = 0; j < getSize() - 1; j++) {
//                if (sites[i][j]) count++;
//            }
//        }
//        return count;
    }

    // does the system percolate?
    public boolean percolates()  {
        if (getSize() == 1)
            return sites[0][0];

        return unionFind.connected(0, getSize()*getSize() - 1);
    }

    // test client
    public static void main(String[] args) {
        Percolation percolation = new Percolation(5);

        System.out.println(percolation.unionFind.connected(0, 4));
        System.out.println(percolation.unionFind.connected(0, 6));
        System.out.println(percolation.unionFind.connected(20, 24));
        System.out.println(percolation.unionFind.connected(19, 24));
    }

    private int getSize() {
        return sites.length;
    }

    private void validate(int i, int j) {
        if (i <= 0 || i > getSize()) throw new IllegalArgumentException("row index i out of bounds");
        if (j <= 0 || j > getSize()) throw new IllegalArgumentException("row index j out of bounds");
    }

    private int xyTo1D(int i, int j) {
        return i*getSize() + j;
    }
}

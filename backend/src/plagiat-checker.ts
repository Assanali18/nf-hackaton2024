import axios, { AxiosResponse } from 'axios';
import simpleGit from 'simple-git';
import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';

import 'dotenv/config';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

searchCode('import express from "express";');




const REPOS_DIR = path.join(__dirname, 'repos');
const ALLOWED_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx']; 

if (!fs.existsSync(REPOS_DIR)) {
    fs.mkdirSync(REPOS_DIR);
}


function getAllCodeFiles(dir: string, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            getAllCodeFiles(filePath, fileList);
        } else if (ALLOWED_EXTENSIONS.includes(path.extname(file))) {
            fileList.push(filePath);
        }
    });

    return fileList;
}


export const checkRepositoryForPlagiarism = async (repoUrl: string): Promise<{isPlagiarismSuspected: boolean, suspectedRepoUrl: string | null}> => {
    if (!repoUrl) {
        throw new Error('Repository URL is required');
    }

    try {
        const repoName = path.basename(repoUrl, '.git');
        const repoPath = path.join(REPOS_DIR, repoName);

        await simpleGit().clone(repoUrl, repoPath);

        const filesInRepo = getAllCodeFiles(repoPath);
        const repoOccurrences: { [key: string]: number } = {};

        for (let file of filesInRepo) {
            const content = fs.readFileSync(file, 'utf-8');
            const searchResults = await searchCode(content);

            if (searchResults && searchResults.length > 0) {
                for (const item of searchResults) {
                    const htmlUrl = item.repository.html_url;
                    if (repoOccurrences[htmlUrl]) {
                        repoOccurrences[htmlUrl]++;
                    } else {
                        repoOccurrences[htmlUrl] = 1;
                    }
                }
            }
        }

        let mostFrequentRepoUrl: string | null = null;
        let maxCount = 0;

        for (const [url, count] of Object.entries(repoOccurrences)) {
            if (count > maxCount) {
                maxCount = count;
                mostFrequentRepoUrl = url;
            }
        }

        const isPlagiarismSuspected = maxCount / filesInRepo.length > 0.5;

        return {
            isPlagiarismSuspected,
            suspectedRepoUrl: isPlagiarismSuspected ? mostFrequentRepoUrl : null
        };
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred while processing the repository');
    } finally {
        rimraf.sync(REPOS_DIR);
    }
}


async function searchCode(query: string): Promise<any[]> {
    const trimmedQuery = query
        .replace(/\/\/.*$/gm, '') // Remove single line comments
        .replace(/\/\*[\s\S]*?\*\//gm, '') // Remove block comments
        .replace(/\r?\n|\r/g, ' ') // Replace newlines with spaces
        .replace(/\s+/g, ' ') // Remove extra spaces
        .trim();

    const words = trimmedQuery.split(' ');
    const chunks: string[] = [];

    for (let i = 0; i < words.length; i += 40) {
        chunks.push(words.slice(i, i + 40).join(' '));
    }

    const url = `https://api.github.com/search/code`;
    const allResults: any[] = [];

    for (const chunk of chunks) {
        console.log("Chunk:", chunk);
        try {
            const response: AxiosResponse<any> = await axios.get(url, {
                params: {
                    q: chunk,
                    in: 'file'
                },
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`
                }
            });
            allResults.push(...response.data.items);
        } catch (error: any) {
            console.error(error.response?.data || error.message);
        }
    }

    return allResults;
}





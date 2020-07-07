$BaseUri = 'http://www.intelmeal.ru/';
$file = Get-Content -Path '.\productsUri_test.txt';
$counter = 0;
ForEach($path in $file){
    $uri = $BaseUri + $path;
    $counter++;
    Write-Host $counter.ToString() + " Смотрю " + $uri;
    $t = $counter.ToString() +" Смотрю "+ $uri;
    $l = $t + "`r`n";
    add-content 'log.txt' $l;
    $response = Invoke-WebRequest -Uri $uri;
    write-host "посмотрел";
    $path -match ".+/(.+).php$";
    $filename = $Matches[1];
    $content = $response.ParsedHtml.getElementsByClassName('publish1');
    $t =  "Пишу "+ $content[0].textContent.ToString() + " в файл " + $filename +".txt";
    $l = $t + "`r`n";
    add-content 'log.txt' $l;
    write-host "Пишу  в файл " + $filename +".txt";
    $filepath = '.\product\' + $filename +".txt";
    #$cnt = $content[0].outerHTML + "`r`n";
    #add-content $filepath $cnt;
    $cnt = $content[4].outerHTML + "`r`n";
    add-content $filepath $cnt;
}
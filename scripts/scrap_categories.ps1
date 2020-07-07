$BaseUri = 'http://www.intelmeal.ru/';
$InternalLinkIndicator = 'nutrition/foodlist_';
#—траница с категори€ми
$CategoriesUri = 'http://www.intelmeal.ru/nutrition/food_category.php';
$response = Invoke-WebRequest -Uri $CategoriesUri;
#ѕолучаем ссылки на страницы категорий
$CategoriesLinks = $response.ParsedHtml.links|where {$_.pathname.StartsWith($InternalLinkIndicator)}|select pathname;
#ƒл€ каждой ссылки на категорию считываем список ссылок на страницы описаний продуктов
$InternalLinkIndicator = 'nutrition/foodinfo-';
$CategoriesLinks.pathname > cat.txt;
$counter = 0;
foreach($uri in $CategoriesLinks){
    $counter++;
    $CategoryUri = $uri.pathname;
    write-host $counter + " смотрю " + $CategoryUri;
    $CurrentCategoryUri = $BaseUri + $CategoryUri; 
    $response = Invoke-WebRequest -Uri $CurrentCategoryUri;
    $ProductsUri = $response.ParsedHtml.links|where {$_.pathname.StartsWith($InternalLinkIndicator)}|select pathname;
    $ProductsUri.pathname >> productsUri.txt;
    Write-Host $ProductsUri.pathname;
}
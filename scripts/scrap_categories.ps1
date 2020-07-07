$BaseUri = 'http://www.intelmeal.ru/';
$InternalLinkIndicator = 'nutrition/foodlist_';
#�������� � �����������
$CategoriesUri = 'http://www.intelmeal.ru/nutrition/food_category.php';
$response = Invoke-WebRequest -Uri $CategoriesUri;
#�������� ������ �� �������� ���������
$CategoriesLinks = $response.ParsedHtml.links|where {$_.pathname.StartsWith($InternalLinkIndicator)}|select pathname;
#��� ������ ������ �� ��������� ��������� ������ ������ �� �������� �������� ���������
$InternalLinkIndicator = 'nutrition/foodinfo-';
$CategoriesLinks.pathname > cat.txt;
$counter = 0;
foreach($uri in $CategoriesLinks){
    $counter++;
    $CategoryUri = $uri.pathname;
    write-host $counter + " ������ " + $CategoryUri;
    $CurrentCategoryUri = $BaseUri + $CategoryUri; 
    $response = Invoke-WebRequest -Uri $CurrentCategoryUri;
    $ProductsUri = $response.ParsedHtml.links|where {$_.pathname.StartsWith($InternalLinkIndicator)}|select pathname;
    $ProductsUri.pathname >> productsUri.txt;
    Write-Host $ProductsUri.pathname;
}
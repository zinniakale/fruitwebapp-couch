<?php
header("Access-Control-Allow-Origin: *");
require_once "lib/couch.php";
require_once "lib/couchClient.php";
require_once "lib/couchDocument.php";

class Database{
	public function connect(){
		$couch_dsn = "http://localhost:5984/";
		$couch_db = "fruit";
		
		$this->client = new couchClient($couch_dsn, $couch_db);
	}

	protected function _setDatabase($database){
		try {
			$this->doc = $this->client->useDatabase($database);
		} catch (Exception $e) {
			echo $database." not found!";
			exit(1);
		}
	}

	public function getData(){
		$ret = [];
		$this->_setDatabase("fruit");
		$temp = $this->client->getAllDocs();
		foreach ($temp->rows as $key => $value) {
			$id = $value->key;
			$retTemp = $this->client->getDoc($id);
			$r = new stdClass();
			$r->id = $retTemp->_id;
			$r->name = $retTemp->name;
			$r->price = $retTemp->price.".00";
			$r->quantity = $retTemp->quantity;
			$r->distributor = $retTemp->distributor;
			$r->dateAdded = $retTemp->dateAdded;
			$r->priceHistory = array();
			array_push($ret, $r);
		}
		$this->data = $ret;
		$this->_getPriceHistory();
	}

	protected function _getPriceHistory(){
		$this->_setDatabase("fruitprice");
		$temp = $this->client->getAllDocs();
		foreach ($temp->rows as $key => $value) {
			$id = $value->key;
			$retTemp = $this->client->getDoc($id);
			foreach ($this->data as $key => $value) {
				if($retTemp->fruitid == $value->id) {
					$r = new stdClass();
					$r->id = $retTemp->_id;
					$r->price = $retTemp->price.".00";
					$r->dateUpdated = $retTemp->dateUpdated;
					array_push($value->priceHistory, $r);
					break;
				}
			}
		}
	}

	public function addFruit($name, $price, $qty, $distributor, $date){
		$this->_setDatabase("fruit");
		$doc = new stdClass();
		$doc->name = $name;
		$doc->price =$price;
		$doc->quantity = $qty;
		$doc->distributor = $distributor;
		$doc->dateAdded = $date;

		$result = $this->client->storeDoc($doc);
		return $result->id;
	}

	public function addFruitPrices($id, $price, $dateUpdated){
		$this->_setDatabase("fruitprice");
		$doc = new stdClass();
		$doc->fruitid = $id;
		$doc->price =$price;
		$doc->dateUpdated = $dateUpdated;
		$result = $this->client->storeDoc($doc);
		return $result->id;
	}

	public function editFruit($id, $name, $price, $qty, $distributor, $date){
		try{
			$this->_setDatabase("fruit");
			$doc = $this->client->getDoc($id);
			$doc->name = $name;
			$doc->price = $price;
			$doc->quantity =$qty;
			$doc->distributor =$distributor;
			$this->client->storeDoc($doc);
		} catch (Exception $e) {
			echo $e->getMessage();
			exit(1);
		}
	}

	public function deleteFruit($id){
		$this->_setDatabase("fruit");
		$doc = $this->client->getDoc($id);
		$this->client->deleteDoc($doc);
	}

	public function deleteFruitPrices($priceids){
		$this->_setDatabase("fruitprice");
		foreach ($priceids as $key => $priceid) {
			$doc = $this->client->getDoc($priceid);
			$this->client->deleteDoc($doc);	
		}
	}

}

$db = new Database;
$db->connect();

switch($_POST['func']) {
	case 'getData':
		$db->getData();
		echo json_encode($db->data);
		break;
	case 'addData':
		$data = json_decode($_POST['data']);
		$fruitid = $db->addFruit($data->name, $data->price, $data->quantity, $data->distributor, $data->dateAdded);
		$priceid = $db->addFruitPrices($fruitid, $data->priceHistory->price, $data->priceHistory->dateUpdated);
		
		$return = new stdClass();
		$return->fruitid = $fruitid;
		$return->priceid = $priceid;
		echo json_encode($return);
		break;
	case 'updateData':
		$data = json_decode($_POST['data']);
		$db->editFruit($data->id, $data->name, $data->price, $data->quantity, $data->distributor, $data->dateAdded);
		if($data->priceChanged) $db->addFruitPrices($data->id, $data->price, $data->dateUpdated);
		echo 1;
		break;
	case 'deleteData':
		$data = json_decode($_POST['data']);
		$db->deleteFruit($data->id);
		$db->deleteFruitPrices($data->priceids);
		// var_dump($data);
		echo 1;
}
?>